import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

const { width } = Dimensions.get('window');

export default function HeroSlider({ slides }) {
  const scrollRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % slides.length;
      activeIndexRef.current = next;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: next * width, animated: true });
      }
      setActiveIndex(next);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  const goToSlide = (index) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    activeIndexRef.current = index;
    setActiveIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * width, animated: true });
    }
    intervalRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % slides.length;
      activeIndexRef.current = next;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: next * width, animated: true });
      }
      setActiveIndex(next);
    }, 5000);
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <ImageBackground
              source={{ uri: slide.image }}
              style={styles.image}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(11,45,78,0.5)', 'rgba(11,45,78,0.88)']}
                style={styles.gradient}
              >
                <View style={styles.content}>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={12} color={colors.accent} />
                    <Text style={styles.location}> {slide.destination}</Text>
                  </View>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goToSlide(i)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <View style={i === activeIndex ? styles.activeDot : styles.dot} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 430,
  },
  slide: {
    width: width,
    height: 430,
  },
  image: {
    width: width,
    height: 430,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 56,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
    marginHorizontal: 3,
  },
});
