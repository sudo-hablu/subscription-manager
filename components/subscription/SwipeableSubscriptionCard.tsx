import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import SubscriptionCard from './SubscriptionCard';
import { Subscription } from '@/types/subscription';

interface SwipeableSubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
  onDelete?: (id: string) => void;
}

export default function SwipeableSubscriptionCard({ 
  subscription, 
  onPress, 
  onDelete 
}: SwipeableSubscriptionCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      lastOffset.current += translationX;

      if (translationX < -100) {
        // Swipe left to reveal delete
        Animated.spring(translateX, {
          toValue: -80,
          useNativeDriver: true,
        }).start();
        lastOffset.current = -80;
      } else if (translationX > 50) {
        // Swipe right to hide delete
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        lastOffset.current = 0;
      } else {
        // Return to original position
        Animated.spring(translateX, {
          toValue: lastOffset.current > -40 ? 0 : -80,
          useNativeDriver: true,
        }).start();
        lastOffset.current = lastOffset.current > -40 ? 0 : -80;
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete ${subscription.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Reset position
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            lastOffset.current = 0;
          }
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete?.(subscription.id);
            // Reset position
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            lastOffset.current = 0;
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Delete Action */}
      <View style={styles.deleteAction}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Card */}
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <SubscriptionCard subscription={subscription} onPress={onPress} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 12,
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 16,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
});