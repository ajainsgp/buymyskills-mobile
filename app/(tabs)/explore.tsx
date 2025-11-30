import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import API_BASE from '../../shared/utils/apiBase';

interface User {
  id: string;
  name: string;
  emailId: string;
  category?: string;
  summary?: string;
  photoPresent?: boolean;
}

export default function BrowseScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();
  const { user } = useAuth();

  const categories = [
    'all',
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Data Analyst',
    'UI/UX Designer',
    'Project Manager',
  ];

  useEffect(() => {
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/users/public`, {
        headers: {
          'x-current-user': JSON.stringify(user),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        Alert.alert('Error', 'Failed to load users');
      }
    } catch (error) {
      console.error('Load users error:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      user.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const renderUserCard = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        Alert.alert('User Profile', `View profile of ${item.name}`);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userCategory}>{item.category || 'No category'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.userSummary} numberOfLines={2}>
          {item.summary || 'No description available'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            router.push({
              pathname: '/message-compose',
              params: {
                receiverId: item.id,
                receiverName: item.name,
              },
            });
          }}
        >
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ThemedText type="title" style={styles.title}>
            Browse Skills
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover talented professionals in your area
          </ThemedText>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.signInButtonText}>Sign In to Browse</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Browse Skills
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Find the perfect professional for your project
        </ThemedText>
      </View>

      {/* Search and Filter */}
      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, skill, or description..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.categoryFilters}>
          {categories.slice(0, 4).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}>
                {category === 'all' ? 'All' : category.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* User List */}
      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading professionals...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserCard}
          style={styles.userList}
          contentContainerStyle={styles.userListContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No professionals found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  signInButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  filters: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  categoryFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  userList: {
    flex: 1,
  },
  userListContent: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 2,
  },
  userCategory: {
    fontSize: 14,
    color: '#6c757d',
  },
  cardBody: {
    marginBottom: 12,
  },
  userSummary: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  contactButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});
