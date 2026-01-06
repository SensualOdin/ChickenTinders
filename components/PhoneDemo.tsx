import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';

export function PhoneDemo() {
  // Animation for the swipe effect
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create the swipe animation sequence
    const swipeAnimation = Animated.sequence([
      // Hold for 2 seconds
      Animated.delay(2000),
      // Swipe right with rotation
      Animated.parallel([
        Animated.timing(swipeAnim, {
          toValue: 200,
          duration: 600,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 15,
          duration: 600,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Reset instantly
      Animated.parallel([
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      // Hold before repeating
      Animated.delay(1000),
    ]);

    // Loop the animation
    Animated.loop(swipeAnimation).start();
  }, [swipeAnim, rotateAnim, opacityAnim]);

  const animatedStyle = {
    transform: [
      { translateX: swipeAnim },
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 15],
          outputRange: ['0deg', '15deg'],
        })
      },
    ],
    opacity: opacityAnim,
  };

  return (
    <View style={styles.container}>
      {/* Phone Frame */}
      <View style={styles.phoneFrame}>
        {/* Phone Screen with gradient background */}
        <LinearGradient
          colors={['#FFF9F5', '#FFF5EE']}
          style={styles.phoneScreen}
        >
          {/* Notch */}
          <View style={styles.notch} />

          {/* Phone Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Friday Night Crew</Text>
          </View>

          {/* Cards Container */}
          <View style={styles.cardsContainer}>
            {/* Card 3 - Back (Pizza) */}
            <View style={[styles.card, styles.cardBack]}>
              <LinearGradient
                colors={['#FFB800', '#E6A500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardImage}
              >
                <Text style={styles.cardEmoji}>🍕</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>Pizza Palace</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardRating}>★ 4.6</Text>
                  <Text style={styles.cardMetaText}>0.8 mi</Text>
                  <Text style={styles.cardMetaText}>$$</Text>
                </View>
              </View>
            </View>

            {/* Card 2 - Middle (Salad) */}
            <View style={[styles.card, styles.cardMiddle]}>
              <LinearGradient
                colors={['#4CAF50', '#45A049']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardImage}
              >
                <Text style={styles.cardEmoji}>🥗</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>Green Garden</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardRating}>★ 4.8</Text>
                  <Text style={styles.cardMetaText}>1.2 mi</Text>
                  <Text style={styles.cardMetaText}>$$</Text>
                </View>
              </View>
            </View>

            {/* Card 1 - Top (Burger) - Animated */}
            <Animated.View style={[styles.card, styles.cardTop, animatedStyle]}>
              <LinearGradient
                colors={['#FF8C5C', '#FF6B35']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardImage}
              >
                <Text style={styles.cardEmoji}>🍔</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>Burger Barn</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardRating}>★ 4.7</Text>
                  <Text style={styles.cardMetaText}>0.5 mi</Text>
                  <Text style={styles.cardMetaText}>$$</Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Nope Button */}
            <View style={styles.nopeButton}>
              <Text style={styles.nopeText}>✕</Text>
            </View>

            {/* Like Button */}
            <View style={styles.likeButton}>
              <Text style={styles.likeText}>♥</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 320,
    height: 640,
    backgroundColor: '#2C0A0A',
    borderRadius: 40,
    padding: 12,
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 50 },
    shadowOpacity: 0.4,
    shadowRadius: 100,
    elevation: 20,
  },
  phoneScreen: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  notch: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 28,
    backgroundColor: '#2C0A0A',
    borderRadius: 20,
    zIndex: 10,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: '600',
    color: '#2C0A0A',
  },
  cardsContainer: {
    position: 'relative',
    height: 360,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  card: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 280,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  cardBack: {
    transform: [{ scale: 0.9 }, { translateY: 30 }],
    opacity: 0.4,
    zIndex: 1,
  },
  cardMiddle: {
    transform: [{ scale: 0.95 }, { translateY: 15 }],
    opacity: 0.7,
    zIndex: 2,
  },
  cardTop: {
    zIndex: 3,
  },
  cardImage: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardEmoji: {
    fontSize: 56,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  cardContent: {
    padding: 12,
    paddingHorizontal: 16,
  },
  cardName: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: '600',
    color: '#2C0A0A',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  cardRating: {
    fontSize: 13,
    color: '#FFB800',
  },
  cardMetaText: {
    fontSize: 13,
    color: '#6B6560',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  nopeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  nopeText: {
    fontSize: 24,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  likeText: {
    fontSize: 24,
    color: 'white',
  },
});
