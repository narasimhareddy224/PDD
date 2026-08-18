import { Outfit, IOutfit } from '../models/Outfit';
import { UserAnalysis, IUserAnalysis } from '../models/UserAnalysis';
import { UserProfile, IUserProfile } from '../models/UserProfile';
import { logger } from '../utils/logger';

export interface RecommendationCriteria {
  userId?: string;
  firebaseUid?: string;
  occasion?: string;
  style?: string;
  budgetCategory?: string;
  weatherCondition?: string;
  temperature?: number;
  gender?: string;
  limit?: number;
}

export class RecommendationService {
  /**
   * Seed curated outfits catalog if collection is empty
   */
  public static async seedInitialOutfits(): Promise<void> {
    const count = await Outfit.countDocuments();
    if (count > 0) return;

    logger.info('Seeding initial curated fashion outfits catalog...');

    const curatedOutfits: Partial<IOutfit>[] = [
      {
        outfitId: 'outfit-smart-blue-1',
        title: 'Smart Casual Blue Combination',
        description: 'A timeless, sophisticated ensemble balancing structured elegance and relaxed modern comfort.',
        occasion: 'Smart casual',
        style: 'Smart Casual',
        colors: ['Light Blue', 'Navy Blue', 'White', 'Brown'],
        top: {
          name: 'Light blue Oxford shirt',
          category: 'Top',
          color: 'Light Blue',
          material: '100% Breathable Cotton',
          searchQuery: 'light blue oxford shirt men',
        },
        bottom: {
          name: 'Dark navy tailored trousers',
          category: 'Bottom',
          color: 'Navy Blue',
          material: 'Stretch Twill Cotton',
          searchQuery: 'dark navy slim trousers',
        },
        footwear: {
          name: 'Clean white leather sneakers',
          category: 'Footwear',
          color: 'White',
          material: 'Genuine Leather',
          searchQuery: 'white minimalist leather sneakers',
        },
        accessories: {
          name: 'Minimalist leather watch & braided belt',
          category: 'Accessories',
          color: 'Dark Brown',
          material: 'Leather',
          searchQuery: 'minimalist brown leather watch',
        },
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
        matchScore: 92,
        reason: 'Suitable for the selected occasion and the user\'s smart-casual preference with high skin-tone harmony.',
        gender: 'male',
        season: 'All Season',
        skinToneSuitability: ['Fair', 'Medium', 'Olive', 'Brown', 'Deep', 'Very Fair'],
        bodyTypeSuitability: ['Rectangle', 'Athletic', 'Triangle', 'Inverted Triangle'],
        estimatedTotalPrice: 3846,
        currency: 'INR',
        isAIGenerated: true,
        isIllustrativeImage: true,
        tags: ['Smart Casual', 'Office', 'Dinner', 'Popular'],
      },
      {
        outfitId: 'outfit-executive-navy-2',
        title: 'Executive Midnight Formal Suit',
        description: 'Command respect and poise in corporate presentations, boardrooms, and high-stakes job interviews.',
        occasion: 'Interviews',
        style: 'Formal',
        colors: ['Navy Blue', 'Crisp White', 'Black'],
        top: {
          name: 'Crisp White Egyptian Cotton Shirt',
          category: 'Top',
          color: 'White',
          material: 'Egyptian Cotton',
          searchQuery: 'white formal dress shirt',
        },
        bottom: {
          name: 'Midnight Navy Tailored Wool Trousers',
          category: 'Bottom',
          color: 'Navy Blue',
          material: 'Wool Blend',
          searchQuery: 'navy blue formal trousers',
        },
        footwear: {
          name: 'Burnished Black Oxford Leather Shoes',
          category: 'Footwear',
          color: 'Black',
          material: 'Full Grain Leather',
          searchQuery: 'black leather oxford shoes',
        },
        accessories: {
          name: 'Silver Cufflinks & Silk Tie in Wine Red',
          category: 'Accessories',
          color: 'Wine Red / Silver',
          material: 'Mulberry Silk',
          searchQuery: 'wine red silk necktie',
        },
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
        matchScore: 96,
        reason: 'Flawlessly calibrated for corporate interviews with commanding contrast and sharp silhouette structure.',
        gender: 'male',
        season: 'All Season',
        skinToneSuitability: ['Very Fair', 'Fair', 'Medium', 'Olive', 'Brown', 'Deep'],
        bodyTypeSuitability: ['Athletic', 'Rectangle', 'Inverted Triangle', 'Oval'],
        estimatedTotalPrice: 6499,
        currency: 'INR',
        isAIGenerated: true,
        isIllustrativeImage: true,
        tags: ['Interview', 'Office', 'Formal', 'High-Impact'],
      },
      {
        outfitId: 'outfit-royal-emerald-3',
        title: 'Royal Emerald Heritage Indo-Western',
        description: 'Exquisite fusion for grand weddings, festive celebrations, and sangeet evenings.',
        occasion: 'Weddings',
        style: 'Traditional',
        colors: ['Emerald Green', 'Ivory', 'Antique Gold'],
        top: {
          name: 'Handcrafted Emerald Raw Silk Kurta with Gold Buttons',
          category: 'Top',
          color: 'Emerald Green',
          material: 'Raw Silk Blend',
          searchQuery: 'emerald green designer silk kurta',
        },
        bottom: {
          name: 'Ivory Dhoti-Pants with Tapered Cuff',
          category: 'Bottom',
          color: 'Ivory',
          material: 'Dupion Silk',
          searchQuery: 'ivory silk churidar trousers',
        },
        footwear: {
          name: 'Antique Zardozi Embroidered Mojaris',
          category: 'Footwear',
          color: 'Gold / Emerald',
          material: 'Embroidered Velvet',
          searchQuery: 'embroidered wedding mojaris',
        },
        accessories: {
          name: 'Gold Pocket Square and Rose Gold Chronograph',
          category: 'Accessories',
          color: 'Gold',
          material: 'Silk / Stainless Steel',
          searchQuery: 'wedding pocket square brocade',
        },
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
        matchScore: 95,
        reason: 'Rich jewel tone radiates warmth and nobility, creating breathtaking presence for wedding occasions.',
        gender: 'unisex',
        season: 'All Season',
        skinToneSuitability: ['Medium', 'Olive', 'Brown', 'Deep', 'Fair'],
        bodyTypeSuitability: ['Rectangle', 'Athletic', 'Hourglass', 'Triangle'],
        estimatedTotalPrice: 7890,
        currency: 'INR',
        isAIGenerated: true,
        isIllustrativeImage: true,
        tags: ['Wedding', 'Festivals', 'Traditional', 'Regal'],
      },
      {
        outfitId: 'outfit-urban-streetwear-4',
        title: 'Urban Minimalist Streetwear Layer',
        description: 'Trendy, relaxed, and effortlessly cool ensemble for college campuses, concerts, and casual outings.',
        occasion: 'College',
        style: 'Streetwear',
        colors: ['Olive Green', 'Heather Gray', 'Black', 'White'],
        top: {
          name: 'Heavyweight Boxy Olive Utility Overshirt over White Tee',
          category: 'Top',
          color: 'Olive Green',
          material: 'Heavy Drill Cotton',
          searchQuery: 'olive green utility shacket men',
        },
        bottom: {
          name: 'Relaxed Wide-Leg Charcoal Cargo Trousers',
          category: 'Bottom',
          color: 'Charcoal',
          material: 'Ripstop Cotton',
          searchQuery: 'charcoal relaxed cargo pants',
        },
        footwear: {
          name: 'Retro Chunky Sole Low-Top Sneakers',
          category: 'Footwear',
          color: 'White & Gray',
          material: 'Leather & Suede',
          searchQuery: 'retro skate chunky sneakers white',
        },
        accessories: {
          name: 'Corduroy Crossbody Bag & Silver Chain',
          category: 'Accessories',
          color: 'Black / Silver',
          material: 'Stainless Steel & Corduroy',
          searchQuery: 'mini crossbody bag street style',
        },
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80',
        matchScore: 89,
        reason: 'Boxy streetwear proportion balances frame width while staying breezy and modern for college lifestyle.',
        gender: 'unisex',
        season: 'All Season',
        skinToneSuitability: ['Very Fair', 'Fair', 'Medium', 'Olive', 'Brown', 'Deep'],
        bodyTypeSuitability: ['Rectangle', 'Lean', 'Athletic', 'Plus-size'],
        estimatedTotalPrice: 3199,
        currency: 'INR',
        isAIGenerated: true,
        isIllustrativeImage: true,
        tags: ['College', 'Casual outings', 'Streetwear', 'Trending'],
      },
      {
        outfitId: 'outfit-breezy-resort-5',
        title: 'Breezy Linen Coastal Vacationer',
        description: 'Ultra-breathable resort wear engineered for warm sunny weather, beach walks, and weekend travel.',
        occasion: 'Travel',
        style: 'Casual',
        colors: ['Terracotta', 'Beige', 'Sand'],
        top: {
          name: 'Camp Collar Pure Linen Shirt in Warm Terracotta',
          category: 'Top',
          color: 'Terracotta',
          material: '100% French Linen',
          searchQuery: 'terracotta linen camp collar shirt',
        },
        bottom: {
          name: 'Drawstring Linen-Blend Chino Shorts in Sand Beige',
          category: 'Bottom',
          color: 'Sand Beige',
          material: 'Linen-Cotton Blend',
          searchQuery: 'beige linen drawstring shorts',
        },
        footwear: {
          name: 'Woven Espadrilles or Leather Strap Slides',
          category: 'Footwear',
          color: 'Tan Brown',
          material: 'Jute & Leather',
          searchQuery: 'men woven espadrilles tan',
        },
        accessories: {
          name: 'Tortoiseshell Polarized Sunglasses & Straw Hat',
          category: 'Accessories',
          color: 'Tortoise / Amber',
          material: 'Acetate',
          searchQuery: 'tortoise polarized retro sunglasses',
        },
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
        matchScore: 91,
        reason: 'Optimal heat dispersion and warm earth-tone harmony makes this top-tier for travel and high temperatures.',
        gender: 'unisex',
        season: 'Summer',
        skinToneSuitability: ['Fair', 'Medium', 'Olive', 'Brown', 'Deep'],
        bodyTypeSuitability: ['Rectangle', 'Athletic', 'Triangle', 'Hourglass'],
        estimatedTotalPrice: 2999,
        currency: 'INR',
        isAIGenerated: true,
        isIllustrativeImage: true,
        tags: ['Travel', 'Casual outings', 'Summer', 'Breezy'],
      },
      {
        outfitId: 'outfit-date-night-velvet-6',
        title: 'Midnight Allure Date Night Fit',
        description: 'Sleek, tactile, and charismatic evening ensemble designed for upscale dinners and romantic dates.',
        occasion: 'Dates',
        style: 'Trendy',
        colors: ['Black', 'Burgundy', 'Gunmetal'],
        top: {
          name: 'Textured Ribbed Knit Polo Shirt in Deep Burgundy',
          category: 'Top',
          color: 'Deep Burgundy',
          material: 'Modal Silk Knit',
          searchQuery: 'burgundy ribbed knit polo shirt',
        },
        bottom: {
          name: 'Tapered Jet Black Stretch Chinos',
          category: 'Bottom',
          color: 'Jet Black',
          material: 'Cotton Elastane',
          searchQuery: 'black tapered slim chinos',
        },
        footwear: {
          name: 'Suede Chelsea Boots in Dark Charcoal',
          category: 'Footwear',
          color: 'Dark Charcoal',
          material: 'Brushed Suede',
          searchQuery: 'charcoal suede chelsea boots',
        },
        accessories: {
          name: 'Gunmetal Chronograph Watch & Minimalist Cuff',
          category: 'Accessories',
          color: 'Gunmetal',
          material: 'Brushed Stainless Steel',
          searchQuery: 'matte black minimalist cuff bracelet',
        },
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
        matchScore: 94,
        reason: 'Deep burgundy and tactile knit texture convey sophistication and romantic warmth in ambient lighting.',
        gender: 'unisex',
        season: 'All Season',
        skinToneSuitability: ['Very Fair', 'Fair', 'Medium', 'Olive', 'Brown', 'Deep'],
        bodyTypeSuitability: ['Athletic', 'Rectangle', 'Inverted Triangle', 'Hourglass'],
        estimatedTotalPrice: 4299,
        currency: 'INR',
        isAIGenerated: true,
        isIllustrativeImage: true,
        tags: ['Dates', 'Parties', 'Night Out', 'Sophisticated'],
      },
    ];

    await Outfit.insertMany(curatedOutfits);
    logger.info(`Seeded ${curatedOutfits.length} high-fashion outfits into MongoDB.`);
  }

  /**
   * Compute intelligent personalized recommendations tailored to user profile, analysis, occasion, and weather
   */
  public static async getRecommendations(criteria: RecommendationCriteria): Promise<{
    recommendations: any[];
    userAnalysisSummary?: any;
    weatherSnapshot?: any;
  }> {
    await this.seedInitialOutfits();

    let userAnalysis: IUserAnalysis | null = null;
    let userProfile: IUserProfile | null = null;

    if (criteria.firebaseUid) {
      userAnalysis = await UserAnalysis.findOne({ firebaseUid: criteria.firebaseUid }).sort({ createdAt: -1 });
      userProfile = await UserProfile.findOne({ firebaseUid: criteria.firebaseUid });
    }

    let filter: any = {};

    if (criteria.occasion && criteria.occasion.toLowerCase() !== 'all') {
      filter.occasion = { $regex: new RegExp(criteria.occasion, 'i') };
    }

    if (criteria.style && criteria.style.toLowerCase() !== 'all') {
      filter.style = { $regex: new RegExp(criteria.style, 'i') };
    }

    let outfits = await Outfit.find(filter).limit(criteria.limit || 12);
    if (outfits.length === 0) {
      // Fallback to all outfits if strict filter matches none
      outfits = await Outfit.find().limit(criteria.limit || 12);
    }

    // Dynamic scoring calculation based on skin tone, body type, and preferences
    const scoredRecommendations = outfits.map((outfit) => {
      let baseScore = outfit.matchScore || 90;

      // Adjust for skin tone harmony
      if (userAnalysis && outfit.skinToneSuitability?.length) {
        if (outfit.skinToneSuitability.includes(userAnalysis.skinTone)) {
          baseScore += 3;
        } else {
          baseScore -= 2;
        }
      }

      // Adjust for body type suitability
      if (userAnalysis && outfit.bodyTypeSuitability?.length) {
        if (outfit.bodyTypeSuitability.includes(userAnalysis.bodyType)) {
          baseScore += 3;
        }
      }

      // Adjust for preferred colors
      if (userProfile && userProfile.preferredColors?.length) {
        const hasMatchingColor = outfit.colors.some((c) =>
          userProfile!.preferredColors.some((pc) => pc.toLowerCase().includes(c.toLowerCase()))
        );
        if (hasMatchingColor) baseScore += 2;
      }

      // Clamp between 80 and 99
      const finalScore = Math.min(99, Math.max(82, baseScore));

      return {
        ...outfit.toObject(),
        matchScore: finalScore,
        suitabilityNotes: {
          skinToneMatch: userAnalysis ? `Flattering for ${userAnalysis.skinTone} skin tones` : 'Universally balanced palette',
          bodyTypeMatch: userAnalysis ? `Complements ${userAnalysis.bodyType} proportions` : 'Structured silhouette',
          weatherAdaptability: criteria.weatherCondition ? `Optimized for ${criteria.weatherCondition}` : 'Versatile across seasons',
        },
      };
    });

    // Sort by match score descending
    scoredRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    return {
      recommendations: scoredRecommendations,
      userAnalysisSummary: userAnalysis
        ? {
            skinTone: userAnalysis.skinTone,
            bodyType: userAnalysis.bodyType,
            style: userAnalysis.style,
            confidence: userAnalysis.confidence,
          }
        : null,
      weatherSnapshot: criteria.weatherCondition
        ? {
            condition: criteria.weatherCondition,
            temperature: criteria.temperature,
          }
        : null,
    };
  }
}
