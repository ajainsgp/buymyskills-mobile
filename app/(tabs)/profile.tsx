import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import API_BASE from '../../shared/utils/apiBase';

interface UserProfile {
  firstName: string;
  lastName: string;
  nickName: string;
  emailId: string;
  secondaryEmail: string;
  countryCode: string;
  mobile: string;
  category: string;
  summary: string;
  workPreference: string;
  available: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  isWhatsappAvailable: boolean;
  whatsappNumber: string;
  allowEmailContact: boolean;
  allowMobileContact: boolean;
  facebookUrl: string;
  linkedinUrl: string;
  startingPrice: string;
  negotiable: boolean;
  currencyCode: string;
  rateType: string;
}

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    nickName: '',
    emailId: '',
    secondaryEmail: '',
    countryCode: '+1',
    mobile: '',
    category: '',
    summary: '',
    workPreference: 'Remote',
    available: 'Immediate',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    isWhatsappAvailable: false,
    whatsappNumber: '',
    allowEmailContact: false,
    allowMobileContact: false,
    facebookUrl: '',
    linkedinUrl: '',
    startingPrice: '',
    negotiable: false,
    currencyCode: 'USD',
    rateType: 'D',
  });

  const categories = [
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Data Analyst',
    'UI/UX Designer',
    'Project Manager',
  ];

  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'India', code: 'IN' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/users/${user.id}`, {
        headers: {
          'x-current-user': JSON.stringify(user),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const profile = data.user;

        setForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          nickName: profile.nickName || '',
          emailId: profile.emailId || '',
          secondaryEmail: profile.secondaryEmail || '',
          countryCode: profile.countryCode || '+1',
          mobile: profile.mobile || '',
          category: profile.category || '',
          summary: profile.summary || '',
          workPreference: profile.workPreference || 'Remote',
          available: profile.availability || 'Immediate',
          addressLine1: profile.address?.addressLine1 || '',
          addressLine2: profile.address?.addressLine2 || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          postcode: profile.address?.postcode || '',
          country: profile.address?.country || '',
          isWhatsappAvailable: profile.isWhatsappAvailable || false,
          whatsappNumber: profile.whatsappNumber || '',
          allowEmailContact: profile.allowEmailContact || false,
          allowMobileContact: profile.allowMobileContact || false,
          facebookUrl: profile.facebookUrl || '',
          linkedinUrl: profile.linkedinUrl || '',
          startingPrice: profile.startingPrice || '',
          negotiable: profile.negotiable || false,
          currencyCode: profile.currencyCode || 'USD',
          rateType: profile.rateType || 'D',
        });
      }
    } catch (error) {
      console.error('Load profile error:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const updateData = {
        nickName: form.nickName,
        secondaryEmail: form.secondaryEmail,
        countryCode: form.countryCode,
        mobile: form.mobile,
        category: form.category,
        summary: form.summary,
        workPreference: form.workPreference,
        availability: form.available,
        isWhatsappAvailable: form.isWhatsappAvailable,
        whatsappNumber: form.whatsappNumber,
        allowEmailContact: form.allowEmailContact,
        allowMobileContact: form.allowMobileContact,
        facebookUrl: form.facebookUrl,
        linkedinUrl: form.linkedinUrl,
        startingPrice: form.startingPrice,
        negotiable: form.negotiable,
        currencyCode: form.currencyCode,
        rateType: form.rateType,
        address: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country,
        },
      };

      // For now, use direct API call since updateProfile expects different structure
      const response = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-current-user': JSON.stringify(user),
        },
        body: JSON.stringify(updateData),
      });

      const success = response.ok;

      if (success) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigate to home tab and force a refresh
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ThemedText type="title" style={styles.title}>
            Profile
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Please sign in to view your profile
          </ThemedText>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>Loading profile...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName?.[0]?.toUpperCase() || user.emailId?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <ThemedText type="title" style={styles.userName}>
            {user.firstName} {user.lastName}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user.emailId}
          </ThemedText>
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Profile</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nick Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Display name"
              value={form.nickName}
              onChangeText={(value) => setForm(prev => ({ ...prev, nickName: value }))}
            />
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              value={form.addressLine1}
              onChangeText={(value) => setForm(prev => ({ ...prev, addressLine1: value }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              placeholder="Apartment, suite, etc."
              value={form.addressLine2}
              onChangeText={(value) => setForm(prev => ({ ...prev, addressLine2: value }))}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={form.city}
                onChangeText={(value) => setForm(prev => ({ ...prev, city: value }))}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                value={form.state}
                onChangeText={(value) => setForm(prev => ({ ...prev, state: value }))}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Postcode</Text>
              <TextInput
                style={styles.input}
                placeholder="Postcode"
                value={form.postcode}
                onChangeText={(value) => setForm(prev => ({ ...prev, postcode: value }))}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={form.country}
                onChangeText={(value) => setForm(prev => ({ ...prev, country: value }))}
              />
            </View>
          </View>
        </View>

        {/* Contact Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Secondary Email</Text>
            <TextInput
              style={styles.input}
              placeholder="secondary@email.com"
              value={form.secondaryEmail}
              onChangeText={(value) => setForm(prev => ({ ...prev, secondaryEmail: value }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.countryCode]}
                placeholder="+1"
                value={form.countryCode}
                onChangeText={(value) => setForm(prev => ({ ...prev, countryCode: value }))}
                maxLength={5}
              />
              <TextInput
                style={[styles.input, styles.phoneNumber]}
                placeholder="Mobile number"
                value={form.mobile}
                onChangeText={(value) => setForm(prev => ({ ...prev, mobile: value }))}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>This number is available on WhatsApp</Text>
            <Switch
              value={form.isWhatsappAvailable}
              onValueChange={(value) => setForm(prev => ({ ...prev, isWhatsappAvailable: value }))}
            />
          </View>

          {!form.isWhatsappAvailable && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>WhatsApp Number</Text>
              <TextInput
                style={styles.input}
                placeholder="WhatsApp number if different"
                value={form.whatsappNumber}
                onChangeText={(value) => setForm(prev => ({ ...prev, whatsappNumber: value }))}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Allow public to contact me on email</Text>
            <Switch
              value={form.allowEmailContact}
              onValueChange={(value) => setForm(prev => ({ ...prev, allowEmailContact: value }))}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Allow public to contact me on mobile</Text>
            <Switch
              value={form.allowMobileContact}
              onValueChange={(value) => setForm(prev => ({ ...prev, allowMobileContact: value }))}
            />
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Select your category"
              value={form.category}
              onChangeText={(value) => setForm(prev => ({ ...prev, category: value }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Skills Summary</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your key skills and expertise"
              value={form.summary}
              onChangeText={(value) => setForm(prev => ({ ...prev, summary: value }))}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{form.summary.length}/500</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Work Preference</Text>
            <TextInput
              style={styles.input}
              placeholder="Remote, On-site, or Hybrid"
              value={form.workPreference}
              onChangeText={(value) => setForm(prev => ({ ...prev, workPreference: value }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Availability</Text>
            <TextInput
              style={styles.input}
              placeholder="Immediate, In 1 month, etc."
              value={form.available}
              onChangeText={(value) => setForm(prev => ({ ...prev, available: value }))}
            />
          </View>
        </View>

        {/* Social Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facebook URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://facebook.com/yourprofile"
              value={form.facebookUrl}
              onChangeText={(value) => setForm(prev => ({ ...prev, facebookUrl: value }))}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LinkedIn URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.linkedinUrl}
              onChangeText={(value) => setForm(prev => ({ ...prev, linkedinUrl: value }))}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Starting Price</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.currency]}
                placeholder="USD"
                value={form.currencyCode}
                onChangeText={(value) => setForm(prev => ({ ...prev, currencyCode: value }))}
                maxLength={3}
                autoCapitalize="characters"
              />
              <TextInput
                style={[styles.input, styles.price]}
                placeholder="Enter price"
                value={form.startingPrice}
                onChangeText={(value) => setForm(prev => ({ ...prev, startingPrice: value }))}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rate Type</Text>
            <View style={styles.rateButtonRow}>
              <TouchableOpacity
                style={[styles.rateButton, form.rateType === 'H' && styles.rateButtonActive]}
                onPress={() => setForm(prev => ({ ...prev, rateType: 'H' }))}
              >
                <Text style={[styles.rateButtonText, form.rateType === 'H' && styles.rateButtonTextActive]}>
                  Hourly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rateButton, form.rateType === 'D' && styles.rateButtonActive]}
                onPress={() => setForm(prev => ({ ...prev, rateType: 'D' }))}
              >
                <Text style={[styles.rateButtonText, form.rateType === 'D' && styles.rateButtonTextActive]}>
                  Daily
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Price is negotiable</Text>
            <Switch
              value={form.negotiable}
              onValueChange={(value) => setForm(prev => ({ ...prev, negotiable: value }))}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
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
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6c757d',
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#495057',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#495057',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  countryCode: {
    width: 80,
    marginRight: 8,
  },
  phoneNumber: {
    flex: 1,
  },
  currency: {
    width: 80,
    marginRight: 8,
    textAlign: 'center',
  },
  price: {
    flex: 1,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  rateButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  rateButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  rateButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  rateButtonTextActive: {
    color: '#ffffff',
  },
  charCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    padding: 16,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
