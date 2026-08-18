export interface OutfitComponent {
  name: string;
  category: string;
  color: string;
  material?: string;
  searchQuery: string;
}

export interface Outfit {
  _id?: string;
  outfitId: string;
  title: string;
  description: string;
  occasion: string;
  style: string;
  colors: string[];
  top: OutfitComponent;
  bottom: OutfitComponent;
  footwear: OutfitComponent;
  accessories: OutfitComponent;
  image: string;
  matchScore: number;
  reason: string;
  gender: 'male' | 'female' | 'unisex';
  season: string;
  skinToneSuitability: string[];
  bodyTypeSuitability: string[];
  estimatedTotalPrice: number;
  currency: string;
  isAIGenerated: boolean;
  isIllustrativeImage: boolean;
  tags: string[];
  suitabilityNotes?: {
    skinToneMatch?: string;
    bodyTypeMatch?: string;
    weatherAdaptability?: string;
  };
}

export interface FavoriteOutfit {
  _id: string;
  userId: string;
  firebaseUid: string;
  outfit: Outfit;
  notes?: string;
  tags: string[];
  createdAt: string;
}
