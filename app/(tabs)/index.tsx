import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.hero}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <ThemedText type="title" style={styles.heroTitle}>
              Welcome to BuyMySkills
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Connect with skilled professionals for your projects
            </ThemedText>
          </View>

          <View style={styles.features}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🔍</Text>
              </View>
              <ThemedText type="subtitle" style={styles.featureTitle}>
                Browse Skills
              </ThemedText>
              <Text style={styles.featureDescription}>
                Discover talented professionals across various categories
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>💬</Text>
              </View>
              <ThemedText type="subtitle" style={styles.featureTitle}>
                Direct Messaging
              </ThemedText>
              <Text style={styles.featureDescription}>
                Chat directly with professionals to discuss your needs
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>⭐</Text>
              </View>
              <ThemedText type="subtitle" style={styles.featureTitle}>
                Quality Assurance
              </ThemedText>
              <Text style={styles.featureDescription}>
                Verified professionals with ratings and reviews
              </Text>
            </View>
          </View>

          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.secondaryButtonText}>Join as Professional</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcome}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            Welcome back, {user.firstName}!
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Ready to find the perfect professional for your project?
          </ThemedText>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🔍</Text>
            </View>
            <Text style={styles.actionTitle}>Browse Skills</Text>
            <Text style={styles.actionDescription}>Find professionals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>💬</Text>
            </View>
            <Text style={styles.actionTitle}>Messages</Text>
            <Text style={styles.actionDescription}>Check conversations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>👤</Text>
            </View>
            <Text style={styles.actionTitle}>Profile</Text>
            <Text style={styles.actionDescription}>Manage account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Professionals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  hero: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    paddingHorizontal: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    padding: 24,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  welcome: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 20,
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
});
