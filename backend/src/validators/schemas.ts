import { z } from 'zod';

export const UserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer-not-to-say']).optional(),
  age: z.number().min(10).max(120).optional(),
  height: z.number().min(50).max(250).optional(),
  weight: z.number().min(20).max(300).optional(),
  phone: z.string().max(20).optional(),
  preferredColors: z.array(z.string()).optional(),
  preferredStyles: z.array(z.string()).optional(),
  preferredBrands: z.array(z.string()).optional(),
  budget: z.enum(['Under ₹1,000', 'Under ₹2,000', 'Under ₹5,000', '₹5,000+', 'Custom']).optional(),
  customBudget: z.number().positive().optional(),
  preferredOccasions: z.array(z.string()).optional(),
  clothingPreferences: z.object({
    fitPreference: z.enum(['slim', 'regular', 'relaxed', 'oversized']).optional(),
    modestyPreference: z.enum(['standard', 'high', 'flexible']).optional(),
    materialPreferences: z.array(z.string()).optional(),
  }).optional(),
});

export const UserAnalysisEditSchema = z.object({
  skinTone: z.enum(['Very Fair', 'Fair', 'Medium', 'Olive', 'Brown', 'Deep']),
  bodyType: z.enum(['Rectangle', 'Triangle', 'Inverted Triangle', 'Oval', 'Hourglass']),
  fitnessLevel: z.enum(['Lean', 'Average', 'Athletic', 'Muscular', 'Plus-size']),
  style: z.enum(['Casual', 'Formal', 'Smart Casual', 'Streetwear', 'Traditional', 'Sporty', 'Minimalist', 'Trendy']),
  undertone: z.enum(['Warm', 'Cool', 'Neutral']).optional(),
});

export const RecommendationQuerySchema = z.object({
  occasion: z.string().optional(),
  style: z.string().optional(),
  budget: z.string().optional(),
  weather: z.string().optional(),
  temperature: z.string().optional(),
  gender: z.string().optional(),
  limit: z.string().optional(),
});

export const CreateScheduleSchema = z.object({
  outfitId: z.string().min(1, 'Outfit ID is required'),
  occasion: z.string().min(1, 'Occasion is required'),
  scheduleDate: z.string().min(1, 'Schedule date is required'),
  scheduleTime: z.string().optional(),
  notes: z.string().max(500).optional(),
  reminderInterval: z.enum(['1 day before', '12 hours before', '2 hours before', 'At event time', 'None']).optional(),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  context: z.object({
    occasion: z.string().optional(),
    weather: z.string().optional(),
    temperature: z.number().optional(),
    currentOutfitId: z.string().optional(),
  }).optional(),
});

export const ShoppingSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.enum(['Top', 'Bottom', 'Footwear', 'Accessories', 'Full Set']).optional(),
  platform: z.enum(['Amazon', 'Flipkart', 'Myntra', 'Ajio']).optional(),
  maxPrice: z.string().optional(),
  minMatchScore: z.string().optional(),
});
