import grandMeridianImg from '@/assets/hotels/grand-meridian.jpg';
import elaraForestImg from '@/assets/hotels/elara-forest.jpg';
import wGoaImg from '@/assets/hotels/w-goa.jpg';
import raasJodhpurImg from '@/assets/hotels/raas-jodhpur.jpg';
import evolveBackImg from '@/assets/hotels/evolve-back.jpg';
import itcMarathaImg from '@/assets/hotels/itc-maratha.jpg';

// Room gallery images
import gmSuite from '@/assets/rooms/grand-meridian/suite.jpg';
import gmBath from '@/assets/rooms/grand-meridian/bathroom.jpg';
import gmTerrace from '@/assets/rooms/grand-meridian/terrace.jpg';
import efSuite from '@/assets/rooms/elara-forest/suite.jpg';
import efBath from '@/assets/rooms/elara-forest/bathroom.jpg';
import efDeck from '@/assets/rooms/elara-forest/deck.jpg';
import wgSuite from '@/assets/rooms/w-goa/suite.jpg';
import wgBath from '@/assets/rooms/w-goa/bathroom.jpg';
import wgBalcony from '@/assets/rooms/w-goa/balcony.jpg';
import rjSuite from '@/assets/rooms/raas-jodhpur/suite.jpg';
import rjBath from '@/assets/rooms/raas-jodhpur/bathroom.jpg';
import rjTerrace from '@/assets/rooms/raas-jodhpur/terrace.jpg';
import ebSuite from '@/assets/rooms/evolve-back/suite.jpg';
import ebBath from '@/assets/rooms/evolve-back/bathroom.jpg';
import ebPool from '@/assets/rooms/evolve-back/pool.jpg';
import imSuite from '@/assets/rooms/itc-maratha/suite.jpg';
import imSpa from '@/assets/rooms/itc-maratha/spa.jpg';
import imPool from '@/assets/rooms/itc-maratha/pool.jpg';

export const hotels = [
  {
    id: 1,
    name: "The Grand Meridian",
    city: "Mumbai",
    area: "Bandra West",
    stars: 5,
    price: 8400,
    vibe: ["business", "luxury"],
    aiPick: true,
    friendCount: 3,
    friendRating: 4.8,
    emoji: "🏙️",
    gradient: "from-slate-800 via-slate-900 to-black",
    image: grandMeridianImg,
    description: "An iconic landmark where power meets prestige. Floor-to-ceiling city views, Michelin-star dining, and curated business suites redefine the Mumbai skyline experience.",
    amenities: ["Rooftop Pool", "Spa & Wellness", "Fine Dining", "Business Centre", "Valet Parking", "Concierge 24/7", "Fitness Centre", "In-Room Butler"],
    rooms: [
      { type: "Deluxe City View", size: "52 sqm", price: 8400, aiSuggested: false },
      { type: "Executive Suite", size: "88 sqm", price: 14500, aiSuggested: true },
      { type: "Grand Penthouse", size: "240 sqm", price: 48000, aiSuggested: false },
    ],
    roomGallery: [gmSuite, gmBath, gmTerrace],
  },
  {
    id: 2,
    name: "Elara Forest Retreat",
    city: "Coorg",
    area: "Karnataka",
    stars: 5,
    price: 12000,
    vibe: ["romantic", "luxury"],
    aiPick: false,
    friendCount: 0,
    friendRating: 0,
    emoji: "🌿",
    gradient: "from-green-950 via-emerald-950 to-black",
    image: elaraForestImg,
    description: "Nestled in 50 acres of coffee and spice plantations, Elara is a haven for those seeking stillness. Treehouse suites, forest baths, and plantation breakfasts await.",
    amenities: ["Infinity Pool", "Yoga Deck", "Spa", "Plantation Tours", "Bonfire Evenings", "Organic Dining", "Bird Watching", "Cycling Trails"],
    rooms: [
      { type: "Forest Cottage", size: "45 sqm", price: 12000, aiSuggested: false },
      { type: "Treehouse Suite", size: "62 sqm", price: 18500, aiSuggested: true },
      { type: "Plantation Villa", size: "120 sqm", price: 32000, aiSuggested: false },
    ],
    roomGallery: [efSuite, efBath, efDeck],
  },
  {
    id: 3,
    name: "W Goa",
    city: "Goa",
    area: "Vagator",
    stars: 5,
    price: 18000,
    vibe: ["luxury", "adventure"],
    aiPick: true,
    friendCount: 2,
    friendRating: 4.6,
    emoji: "🌊",
    gradient: "from-blue-950 via-indigo-950 to-black",
    image: wGoaImg,
    description: "Where Goa's raw energy meets bold design. Clifftop infinity pool overlooking the Arabian Sea, WET® Bar, and E-WOW Suites that redefine beach luxury.",
    amenities: ["Clifftop Pool", "WET Bar", "AWAY Spa", "Beach Club", "DJ Nights", "Watersports", "Sunrise Yoga", "Fine Dining"],
    rooms: [
      { type: "Wonderful Room", size: "40 sqm", price: 18000, aiSuggested: false },
      { type: "Spectacular Suite", size: "75 sqm", price: 28000, aiSuggested: false },
      { type: "E-WOW Suite", size: "160 sqm", price: 65000, aiSuggested: true },
    ],
    roomGallery: [wgSuite, wgBath, wgBalcony],
  },
  {
    id: 4,
    name: "RAAS Jodhpur",
    city: "Jodhpur",
    area: "Rajasthan",
    stars: 5,
    price: 22000,
    vibe: ["romantic", "luxury"],
    aiPick: false,
    friendCount: 1,
    friendRating: 4.9,
    emoji: "🏰",
    gradient: "from-orange-950 via-amber-950 to-black",
    image: raasJodhpurImg,
    description: "A heritage property carved into the Mehrangarh rock face. Ancient stone architecture, rooftop dining with fort views, and royal Rajput hospitality.",
    amenities: ["Heritage Pool", "Rooftop Restaurant", "Ayurvedic Spa", "Fort Views", "Cooking Classes", "Horse Safari", "Cultural Evenings", "Butler Service"],
    rooms: [
      { type: "Heritage Room", size: "48 sqm", price: 22000, aiSuggested: false },
      { type: "Haveli Suite", size: "92 sqm", price: 38000, aiSuggested: true },
      { type: "Royal Suite", size: "180 sqm", price: 75000, aiSuggested: false },
    ],
    roomGallery: [rjSuite, rjBath, rjTerrace],
  },
  {
    id: 5,
    name: "Evolve Back",
    city: "Coorg",
    area: "Karnataka",
    stars: 5,
    price: 15000,
    vibe: ["romantic", "family"],
    aiPick: false,
    friendCount: 1,
    friendRating: 4.7,
    emoji: "☕",
    gradient: "from-stone-900 via-stone-950 to-black",
    image: evolveBackImg,
    description: "Private pool villas hidden within ancient coffee estates. Wake to the scent of fresh arabica, evening fireflies, and world-class Coorg cuisine.",
    amenities: ["Private Pools", "Coffee Estate", "Nature Walks", "Spa", "Cycling", "Kayaking", "Fine Dining", "Kids Activities"],
    rooms: [
      { type: "Kamath Villa", size: "80 sqm", price: 15000, aiSuggested: false },
      { type: "Pool Villa", size: "120 sqm", price: 24000, aiSuggested: true },
      { type: "Estate Bungalow", size: "200 sqm", price: 45000, aiSuggested: false },
    ],
    roomGallery: [ebSuite, ebBath, ebPool],
  },
  {
    id: 6,
    name: "ITC Maratha",
    city: "Mumbai",
    area: "Andheri",
    stars: 5,
    price: 11000,
    vibe: ["business", "luxury"],
    aiPick: true,
    friendCount: 4,
    friendRating: 4.5,
    emoji: "✨",
    gradient: "from-purple-950 via-violet-950 to-black",
    image: itcMarathaImg,
    description: "A tribute to Maratha grandeur. Massive conference facilities, Peshwa Pavilion, three award-winning restaurants, and the signature WelcomSpa experience.",
    amenities: ["Convention Centre", "WelcomSpa", "3 Restaurants", "Rooftop Pool", "Business Lounge", "Limousine Service", "Luxury Shopping", "24hr Butler"],
    rooms: [
      { type: "ITC One Room", size: "55 sqm", price: 11000, aiSuggested: false },
      { type: "Royal Suite", size: "100 sqm", price: 22000, aiSuggested: true },
      { type: "Maratha Suite", size: "280 sqm", price: 85000, aiSuggested: false },
    ],
    roomGallery: [imSuite, imSpa, imPool],
  },
];

export const groupBooking = {
  tripName: "Goa Trip 2026 🌊",
  hotel: "W Goa, Vagator",
  dates: "March 22–25",
  nights: 3,
  total: 144000,
  collected: 86400,
  members: [
    { name: "You (Organiser)", room: "Suite 201", status: "paid", color: "#D4A843" },
    { name: "Rahul Mehta", room: "Deluxe 304", status: "paid", color: "#52C5BD" },
    { name: "Priya Shah", room: "Sea View 401", status: "pending", color: "#D47F8B" },
    { name: "Arjun Kapoor", room: "Deluxe 305", status: "pending", color: "#8B7FD4" },
  ],
};

export const friendsFeed = [
  {
    id: 1,
    name: "Rahul Mehta",
    action: "checked out",
    hotel: "Taj Lands End",
    rating: 5,
    comment: "Pool + sunset view, perfect business stay.",
    tripType: "Business",
    time: "2 hours ago",
    live: false,
    color: "#52C5BD",
    initials: "RM",
  },
  {
    id: 2,
    name: "Priya Shah",
    action: "rated",
    hotel: "Evolve Back, Coorg",
    rating: 4,
    comment: "Worth every rupee. WiFi was slow but vibe was immaculate.",
    tripType: "Romantic",
    time: "Yesterday",
    live: false,
    color: "#D47F8B",
    initials: "PS",
  },
  {
    id: 3,
    name: "Arjun Kapoor",
    action: "is staying at",
    hotel: "W Maldives",
    rating: 0,
    comment: "",
    tripType: "Vacation",
    time: "3 days",
    live: true,
    color: "#8B7FD4",
    initials: "AK",
  },
  {
    id: 4,
    name: "Sneha Raut",
    action: "saved",
    hotel: "RAAS Jodhpur",
    rating: 0,
    comment: "Bucket list ✨",
    tripType: "Planning",
    time: "4 hours ago",
    live: false,
    color: "#7DC97A",
    initials: "SR",
  },
  {
    id: 5,
    name: "Karan Desai",
    action: "checked in",
    hotel: "The Grand Meridian",
    rating: 0,
    comment: "Here for the rooftop pool views.",
    tripType: "Business",
    time: "1 hour ago",
    live: true,
    color: "#D4A843",
    initials: "KD",
  },
];

export const rewardsData = {
  userName: "Arjun",
  tier: "Gold",
  points: 12840,
  nextTier: "Platinum",
  nextTierPoints: 20000,
  rewards: [
    { id: 1, name: "Free Breakfast", points: 2000, unlocked: true, icon: "☕" },
    { id: 2, name: "Room Upgrade", points: 5000, unlocked: true, icon: "🏨" },
    { id: 3, name: "Late Checkout", points: 3000, unlocked: true, icon: "⏰" },
    { id: 4, name: "Airport Transfer", points: 8000, unlocked: true, icon: "🚗" },
    { id: 5, name: "Spa Session", points: 10000, unlocked: true, icon: "💆" },
    { id: 6, name: "Weekend Getaway", points: 20000, unlocked: false, icon: "✈️" },
  ],
  activity: [
    { hotel: "Taj Lands End", points: 840, date: "2 days ago" },
    { hotel: "W Goa", points: 1620, date: "Last week" },
    { hotel: "ITC Maratha", points: 990, date: "2 weeks ago" },
    { hotel: "Evolve Back", points: 1350, date: "Last month" },
  ],
};
