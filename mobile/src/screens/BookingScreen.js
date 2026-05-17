import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, FlatList, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PackageCard from '../components/PackageCard';
import { pickupLocations, vehicleOptions, packages } from '../data/packages';
import { colors, spacing, borderRadius, shadows } from '../theme';

function StepIndicator({ current }) {
  return (
    <View style={si.row}>
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <View style={[si.circle, current >= step && si.activeCircle]}>
            {current > step ? (
              <Ionicons name="checkmark" size={14} color={colors.white} />
            ) : (
              <Text style={current >= step ? si.activeNum : si.num}>{step}</Text>
            )}
          </View>
          {step < 3 && (
            <View style={[si.line, current > step && si.activeLine]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const si = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  num: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.bodyText,
  },
  activeNum: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: colors.primary,
  },
});

function SelectModal({ visible, title, options, selected, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={sm.overlay}>
        <View style={sm.sheet}>
          <View style={sm.handle} />
          <View style={sm.header}>
            <Text style={sm.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.gunmetal} />
            </TouchableOpacity>
          </View>
          <View style={sm.searchBar}>
            <Ionicons name="search" size={15} color={colors.bodyText} />
            <TextInput
              style={sm.searchInput}
              placeholder="Search locations..."
              placeholderTextColor={colors.bodyText}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[sm.option, item === selected && sm.selectedOption]}
                onPress={() => { onSelect(item); onClose(); setQuery(''); }}
              >
                <Ionicons
                  name={item === selected ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={item === selected ? colors.primary : colors.bodyText}
                />
                <Text style={[sm.optionText, item === selected && sm.selectedText]}>
                  {' '}{item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const sm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gunmetal,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: colors.lightBg,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 14,
    color: colors.gunmetal,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBg,
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: 14,
    color: colors.gunmetal,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

function SummaryChip({ icon, label }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon + '-outline'} size={15} color={colors.primary} />
      <Text style={styles.chipText} numberOfLines={1}> {label}</Text>
    </View>
  );
}

export default function BookingScreen() {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [modal, setModal] = useState(null);
  const [booking, setBooking] = useState({
    pickup: '',
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    vehicle: null,
  });

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const ci = new Date(booking.checkIn);
    const co = new Date(booking.checkOut);
    if (isNaN(ci.getTime()) || isNaN(co.getTime())) return 0;
    const diff = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [booking.checkIn, booking.checkOut]);

  const selectedVehicle = vehicleOptions.find((v) => v.id === booking.vehicle) || null;
  const totalPrice = selectedVehicle && nights > 0
    ? Math.round(selectedVehicle.rate * nights * 1.1)
    : 0;

  const recommendedPackages = useMemo(() => {
    return packages.slice(0, 3);
  }, []);

  const validateStep = () => {
    if (step === 1) {
      if (!booking.pickup) {
        Alert.alert('Missing', 'Please select a pickup location.');
        return false;
      }
      if (!booking.destination) {
        Alert.alert('Missing', 'Please select a destination.');
        return false;
      }
      if (booking.pickup === booking.destination) {
        Alert.alert('Invalid', 'Pickup and destination cannot be the same.');
        return false;
      }
    }
    if (step === 2) {
      if (!booking.checkIn) {
        Alert.alert('Missing', 'Please enter check-in date (YYYY-MM-DD).');
        return false;
      }
      if (!booking.checkOut) {
        Alert.alert('Missing', 'Please enter check-out date (YYYY-MM-DD).');
        return false;
      }
      if (nights <= 0) {
        Alert.alert('Invalid', 'Check-out must be after check-in.');
        return false;
      }
    }
    if (step === 3) {
      if (!booking.vehicle) {
        Alert.alert('Missing', 'Please select a vehicle.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setShowResults(false);
    setBooking({ pickup: '', destination: '', checkIn: '', checkOut: '', guests: 2, vehicle: null });
  };

  const swapLocations = () => {
    setBooking((b) => ({ ...b, pickup: b.destination, destination: b.pickup }));
  };

  const stepLabels = ['Route Selection', 'Dates & Guests', 'Vehicle Selection'];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Book Your Trip</Text>
          {!showResults && (
            <Text style={styles.headerSub}>
              Step {step} of 3 — {stepLabels[step - 1]}
            </Text>
          )}
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!showResults ? (
          <View>
            <StepIndicator current={step} />

            {step === 1 && (
              <View style={[styles.card, shadows.card]}>
                <Text style={styles.cardTitle}>Where are you going?</Text>

                <Text style={styles.label}>Pickup Location</Text>
                <TouchableOpacity
                  style={[styles.selector, booking.pickup ? styles.selectorFilled : styles.selectorEmpty]}
                  onPress={() => setModal('pickup')}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={booking.pickup ? colors.primary : colors.bodyText}
                  />
                  <Text style={[styles.selectorText, !booking.pickup && styles.placeholder]}>
                    {' '}{booking.pickup || 'Select pickup location...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.bodyText} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.swapBtn} onPress={swapLocations}>
                  <Ionicons name="swap-vertical" size={18} color={colors.primary} />
                  <Text style={styles.swapText}> Swap Locations</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Destination</Text>
                <TouchableOpacity
                  style={[styles.selector, booking.destination ? styles.selectorFilled : styles.selectorEmpty]}
                  onPress={() => setModal('destination')}
                >
                  <Ionicons
                    name="navigate-outline"
                    size={18}
                    color={booking.destination ? colors.accent : colors.bodyText}
                  />
                  <Text style={[styles.selectorText, !booking.destination && styles.placeholder]}>
                    {' '}{booking.destination || 'Select destination...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.bodyText} />
                </TouchableOpacity>

                {booking.pickup !== '' && booking.destination !== '' && (
                  <View style={styles.routePreview}>
                    <Text style={styles.routeFrom} numberOfLines={1}>{booking.pickup}</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    <Text style={styles.routeTo} numberOfLines={1}>{booking.destination}</Text>
                  </View>
                )}
              </View>
            )}

            {step === 2 && (
              <View style={[styles.card, shadows.card]}>
                <Text style={styles.cardTitle}>When and who?</Text>

                <View style={styles.dateRow}>
                  <View style={styles.dateField}>
                    <Text style={styles.label}>Check-in</Text>
                    <View style={styles.inputBox}>
                      <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                      <TextInput
                        style={styles.dateInput}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.bodyText}
                        value={booking.checkIn}
                        onChangeText={(v) => setBooking((b) => ({ ...b, checkIn: v }))}
                      />
                    </View>
                  </View>
                  <View style={styles.dateField}>
                    <Text style={styles.label}>Check-out</Text>
                    <View style={styles.inputBox}>
                      <Ionicons name="calendar-outline" size={16} color={colors.accent} />
                      <TextInput
                        style={styles.dateInput}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.bodyText}
                        value={booking.checkOut}
                        onChangeText={(v) => setBooking((b) => ({ ...b, checkOut: v }))}
                      />
                    </View>
                  </View>
                </View>

                {nights > 0 && (
                  <View style={styles.nightsBadge}>
                    <Ionicons name="moon-outline" size={14} color={colors.primary} />
                    <Text style={styles.nightsText}>
                      {' '}{nights} night{nights !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}

                <Text style={styles.label}>Number of Guests</Text>
                <View style={styles.guestRow}>
                  <TouchableOpacity
                    style={styles.guestBtn}
                    onPress={() => setBooking((b) => ({ ...b, guests: Math.max(1, b.guests - 1) }))}
                  >
                    <Ionicons name="remove" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <View style={styles.guestCount}>
                    <Text style={styles.guestNum}>{booking.guests}</Text>
                    <Text style={styles.guestLabel}>guests</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.guestBtn}
                    onPress={() => setBooking((b) => ({ ...b, guests: Math.min(20, b.guests + 1) }))}
                  >
                    <Ionicons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={[styles.card, shadows.card]}>
                <Text style={styles.cardTitle}>Choose your vehicle</Text>
                <View style={styles.vehicleGrid}>
                  {vehicleOptions.map((v) => {
                    const active = booking.vehicle === v.id;
                    return (
                      <TouchableOpacity
                        key={v.id}
                        style={[styles.vehicleCard, active ? styles.vehicleCardActive : styles.vehicleCardInactive]}
                        onPress={() => setBooking((b) => ({ ...b, vehicle: v.id }))}
                        activeOpacity={0.85}
                      >
                        {active && (
                          <View style={styles.vehicleCheck}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                          </View>
                        )}
                        <Ionicons
                          name={v.icon}
                          size={32}
                          color={active ? colors.primary : colors.bodyText}
                        />
                        <Text style={active ? styles.vehicleNameActive : styles.vehicleName}>
                          {v.label}
                        </Text>
                        <Text style={active ? styles.vehicleRateActive : styles.vehicleRate}>
                          ${v.rate}/day
                        </Text>
                        <Text style={styles.vehicleCap}>Up to {v.capacity} guests</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {booking.vehicle !== null && nights > 0 && (
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={styles.priceBar}
                  >
                    <View>
                      <Text style={styles.priceBarLabel}>Estimated Transport</Text>
                      <Text style={styles.priceBarNote}>
                        ${selectedVehicle ? selectedVehicle.rate : 0}/day x {nights} nights + 10% tax
                      </Text>
                    </View>
                    <Text style={styles.priceBarTotal}>${totalPrice}</Text>
                  </LinearGradient>
                )}
              </View>
            )}

            <View style={styles.navRow}>
              {step > 1 && (
                <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
                  <Ionicons name="arrow-back" size={18} color={colors.primary} />
                  <Text style={styles.backBtnText}> Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.nextBtn, step === 1 ? styles.nextBtnFull : styles.nextBtnPartial]}
                onPress={handleNext}
              >
                <Text style={styles.nextBtnText}>
                  {step === 3 ? 'Search Packages' : 'Next'}
                </Text>
                <Ionicons
                  name={step === 3 ? 'search' : 'arrow-forward'}
                  size={18}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.results}>
            <View style={styles.resultsHeader}>
              <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
              <Text style={styles.resultsTitle}>Trip Configured!</Text>
              <Text style={styles.resultsSub}>Summary of your selection</Text>
            </View>

            <View style={[styles.summaryCard, shadows.card]}>
              <SummaryChip icon="location" label={booking.pickup + ' → ' + booking.destination} />
              <View style={styles.chipDivider} />
              <SummaryChip icon="people" label={booking.guests + ' guest' + (booking.guests !== 1 ? 's' : '')} />
              <View style={styles.chipDivider} />
              <SummaryChip icon="calendar" label={booking.checkIn + ' → ' + booking.checkOut} />
              <View style={styles.chipDivider} />
              <SummaryChip icon="moon" label={nights + ' night' + (nights !== 1 ? 's' : '')} />
              <View style={styles.chipDivider} />
              <SummaryChip icon="car" label={selectedVehicle ? selectedVehicle.label : 'No vehicle'} />
            </View>

            {totalPrice > 0 && (
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.costCard}
              >
                <View>
                  <Text style={styles.costLabel}>Estimated Transport Cost</Text>
                  <Text style={styles.costNote}>Excludes accommodation and meals</Text>
                </View>
                <Text style={styles.costTotal}>${totalPrice}</Text>
              </LinearGradient>
            )}

            <Text style={styles.packagesTitle}>Recommended Packages</Text>
            {recommendedPackages.map((pkg) => (
              <PackageCard key={pkg.id} item={pkg} onPress={() => {}} />
            ))}

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={16} color={colors.primary} />
              <Text style={styles.resetBtnText}> Start New Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <SelectModal
        visible={modal === 'pickup'}
        title="Select Pickup Location"
        options={pickupLocations}
        selected={booking.pickup}
        onSelect={(v) => setBooking((b) => ({ ...b, pickup: v }))}
        onClose={() => setModal(null)}
      />
      <SelectModal
        visible={modal === 'destination'}
        title="Select Destination"
        options={pickupLocations}
        selected={booking.destination}
        onSelect={(v) => setBooking((b) => ({ ...b, destination: v }))}
        onClose={() => setModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  safeHeader: {
    backgroundColor: colors.dark,
  },
  headerContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gunmetal,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.bodyText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    padding: 13,
    marginBottom: spacing.md,
  },
  selectorFilled: {
    borderColor: colors.primary,
  },
  selectorEmpty: {
    borderColor: colors.border,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    color: colors.gunmetal,
    fontWeight: '500',
  },
  placeholder: {
    color: colors.bodyText,
    fontWeight: '400',
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: spacing.sm,
  },
  swapText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  routePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    borderRadius: borderRadius.sm,
    padding: 10,
    marginTop: 4,
  },
  routeFrom: {
    flex: 1,
    fontSize: 12,
    color: colors.gunmetal,
    fontWeight: '600',
  },
  routeTo: {
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dateField: {
    flex: 1,
    marginRight: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 11,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    color: colors.gunmetal,
  },
  nightsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  nightsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  guestBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestCount: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  guestNum: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gunmetal,
  },
  guestLabel: {
    fontSize: 12,
    color: colors.bodyText,
    marginTop: -4,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  vehicleCard: {
    width: '47%',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    padding: 14,
    alignItems: 'center',
    position: 'relative',
    marginRight: '3%',
    marginBottom: 10,
  },
  vehicleCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EBF4FF',
  },
  vehicleCardInactive: {
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  vehicleCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gunmetal,
    marginTop: 6,
    marginBottom: 2,
  },
  vehicleNameActive: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
    marginBottom: 2,
  },
  vehicleRate: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.bodyText,
    marginBottom: 2,
  },
  vehicleRateActive: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  vehicleCap: {
    fontSize: 11,
    color: colors.bodyText,
    textAlign: 'center',
  },
  priceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  priceBarLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  priceBarNote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  priceBarTotal: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
  },
  navRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: 12,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
  },
  nextBtnFull: {
    flex: 1,
  },
  nextBtnPartial: {
    flex: 1,
  },
  nextBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  },
  results: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  resultsHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gunmetal,
    marginTop: 8,
  },
  resultsSub: {
    fontSize: 13,
    color: colors.bodyText,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  chipText: {
    flex: 1,
    fontSize: 13,
    color: colors.gunmetal,
    fontWeight: '500',
  },
  chipDivider: {
    height: 1,
    backgroundColor: colors.lightBg,
    marginVertical: 6,
  },
  costCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  costLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  costNote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  costTotal: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  packagesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gunmetal,
    marginBottom: spacing.sm,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  resetBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
