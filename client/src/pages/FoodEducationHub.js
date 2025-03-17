import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Kitchen as KitchenIcon,
  Nature as NatureIcon,
  AccessTime as AccessTimeIcon,
  LocalOffer as LocalOfferIcon,
  Bookmarks as BookmarksIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Mock data for recipes
const recipesData = [
  {
    id: 1,
    title: 'Vegetable Stir Fry',
    category: 'Vegetables',
    time: '20 mins',
    difficulty: 'Easy',
    ingredients: [
      '2 cups mixed vegetables (bell peppers, carrots, broccoli)',
      '1 tablespoon oil',
      '2 cloves garlic, minced',
      '1 tablespoon soy sauce',
      '1 teaspoon ginger, grated'
    ],
    instructions: [
      'Heat oil in a large pan or wok over medium-high heat.',
      'Add garlic and ginger, sauté for 30 seconds until fragrant.',
      'Add vegetables and stir-fry for 5-7 minutes until crisp-tender.',
      'Add soy sauce and any other seasonings, stir to combine.',
      'Serve hot over rice or noodles.'
    ],
    tips: 'Use any vegetables that need to be used up soon. This recipe is very flexible!',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 2,
    title: 'Banana Bread',
    category: 'Fruits',
    time: '60 mins',
    difficulty: 'Medium',
    ingredients: [
      '3 ripe bananas, mashed',
      '1/3 cup melted butter',
      '1 teaspoon baking soda',
      'Pinch of salt',
      '3/4 cup sugar',
      '1 large egg, beaten',
      '1 teaspoon vanilla extract',
      '1 1/2 cups all-purpose flour'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and grease a 4x8-inch loaf pan.',
      'Mix mashed bananas with melted butter in a large bowl.',
      'Mix in baking soda, salt, sugar, beaten egg, and vanilla.',
      'Stir in flour and mix until just combined.',
      'Pour batter into prepared pan and bake for 50-60 minutes.',
      'Let cool before slicing.'
    ],
    tips: 'Use overripe bananas with brown spots for the best flavor and natural sweetness.',
    image: 'https://images.unsplash.com/photo-1605288212053-69abf595fe6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 3,
    title: 'Leftover Chicken Soup',
    category: 'Meat',
    time: '45 mins',
    difficulty: 'Easy',
    ingredients: [
      '2 cups leftover chicken, shredded',
      '1 onion, diced',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '6 cups chicken broth',
      '1 teaspoon thyme',
      'Salt and pepper to taste',
      '1 cup pasta or rice (optional)'
    ],
    instructions: [
      'In a large pot, sauté onion, carrots, and celery until soft, about 5 minutes.',
      'Add chicken broth, thyme, salt, and pepper, bring to a boil.',
      'Reduce heat and simmer for 15 minutes.',
      'Add pasta or rice if using, cook until tender.',
      'Add shredded chicken and heat through.',
      'Adjust seasoning and serve hot.'
    ],
    tips: 'This is a great way to use up leftover rotisserie chicken. The soup can be frozen for up to 3 months.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'
  }
];

// Preservation techniques
const preservationTips = [
  {
    category: 'Refrigeration',
    tips: [
      {
        title: 'Optimize Your Refrigerator',
        content: 'Keep your refrigerator at 40°F (4°C) or below. Store dairy on the middle shelf, meat in the bottom drawer, and fruits/vegetables in crisper drawers.'
      },
      {
        title: 'Proper Produce Storage',
        content: 'Store fruits and vegetables separately. Many fruits release ethylene gas which can cause vegetables to spoil faster.'
      },
      {
        title: 'Use Clear Containers',
        content: 'Store leftovers in clear containers so you can see what is inside. Label them with the date to track freshness.'
      }
    ]
  },
  {
    category: 'Freezing',
    tips: [
      {
        title: 'Blanch Before Freezing',
        content: 'Blanch vegetables in boiling water for 1-2 minutes before freezing to preserve color, flavor, and nutrients.'
      },
      {
        title: 'Portion Control',
        content: 'Freeze items in meal-sized portions to avoid thawing more than needed. Use freezer bags with the air pressed out to prevent freezer burn.'
      },
      {
        title: 'Freezer Inventory',
        content: 'Keep an inventory list of what is in your freezer with dates. Most frozen foods maintain quality for 3-6 months.'
      }
    ]
  },
  {
    category: 'Drying & Canning',
    tips: [
      {
        title: 'Herb Preservation',
        content: 'Hang herbs in bunches to air dry, or chop and freeze in ice cube trays with olive oil for ready-to-use flavor bombs.'
      },
      {
        title: 'Fruit Dehydration',
        content: 'Slice fruits thinly and dry in a dehydrator or oven at low temperature (135-145°F) until leathery for healthy snacks.'
      },
      {
        title: 'Safe Canning',
        content: 'For canning, always follow tested recipes to ensure proper acidity and processing times for food safety.'
      }
    ]
  }
];

// Meal planning tips
const mealPlanningTips = [
  {
    title: 'Start with an Inventory',
    content: 'Before planning meals, check what items you already have, especially those approaching their expiration date.'
  },
  {
    title: 'Plan for Leftovers',
    content: 'Intentionally cook larger quantities to repurpose into new meals later in the week. For example, roast chicken can become soup, salad, or tacos.'
  },
  {
    title: 'Create a Flexible Template',
    content: 'Design a weekly template with themes like "Meatless Monday" or "Stir-fry Friday" to provide structure while allowing creativity.'
  },
  {
    title: 'Shop with a List',
    content: 'Create a detailed shopping list based on your meal plan and stick to it to avoid impulse purchases and waste.'
  },
  {
    title: 'Prep in Batches',
    content: 'Dedicate time to wash, chop, and portion ingredients for multiple meals at once, making weekday cooking faster.'
  }
];

// Food scraps utilization
const foodScrapsIdeas = [
  {
    title: 'Vegetable Stock',
    category: 'Kitchen',
    details: 'Save vegetable scraps like onion skins, carrot tops, celery ends, and herb stems in a freezer bag. When full, simmer with water for 1 hour to make flavorful stock.',
    image: 'https://images.unsplash.com/photo-1604905554625-4354ec8edb21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Citrus Cleaner',
    category: 'Household',
    details: 'Soak citrus peels in white vinegar for 2 weeks, then strain into a spray bottle for a natural all-purpose cleaner.',
    image: 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  },
  {
    title: 'Coffee Ground Scrub',
    category: 'Household',
    details: 'Mix used coffee grounds with coconut oil to create an exfoliating body scrub, or sprinkle them in garden soil as a natural fertilizer.',
    image: 'https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'Regrow from Scraps',
    category: 'Garden',
    details: 'Place the root ends of green onions, lettuce, celery, and other vegetables in water to regrow new plants for multiple harvests.',
    image: 'https://images.unsplash.com/photo-1530836176759-510f58baebf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }
];

const FoodEducationHub = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  const renderRecipeList = () => (
    <Grid container spacing={3}>
      {recipesData.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea onClick={() => handleRecipeClick(recipe)}>
              <CardMedia
                component="img"
                height="180"
                image={recipe.image}
                alt={recipe.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {recipe.title}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                  <Chip 
                    icon={<RestaurantMenuIcon />} 
                    label={recipe.category} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<AccessTimeIcon />} 
                    label={recipe.time} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {recipe.tips.substring(0, 80)}...
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderRecipeDetail = () => {
    if (!selectedRecipe) return null;
    
    return (
      <Box>
        <Button 
          variant="outlined" 
          onClick={handleBackToRecipes} 
          sx={{ mb: 2 }}
        >
          Back to Recipes
        </Button>
        
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title} 
                style={{ width: '100%', borderRadius: '8px' }} 
              />
              
              <Box mt={2}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">Time</Typography>
                      <Typography variant="body1" fontWeight="medium">{selectedRecipe.time}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">Difficulty</Typography>
                      <Typography variant="body1" fontWeight="medium">{selectedRecipe.difficulty}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">Category</Typography>
                      <Typography variant="body1" fontWeight="medium">{selectedRecipe.category}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h1" gutterBottom>
                {selectedRecipe.title}
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                {selectedRecipe.tips}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List dense>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <List>
                {selectedRecipe.instructions.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Chip label={index + 1} size="small" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  const renderPreservationTips = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Food Preservation Techniques
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Extend the life of your food and reduce waste with these preservation methods.
      </Typography>
      
      {preservationTips.map((category) => (
        <Accordion 
          key={category.category}
          expanded={expandedAccordion === category.category}
          onChange={handleAccordionChange(category.category)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{category.category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {category.tips.map((tip, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      {tip.title}
                    </Typography>
                    <Typography variant="body2">
                      {tip.content}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const renderMealPlanning = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Meal Planning Strategies
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Effective meal planning reduces food waste and saves money. Here are some practical strategies:
      </Typography>
      
      <Grid container spacing={3}>
        {mealPlanningTips.map((tip, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <BookmarksIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{tip.title}</Typography>
              </Box>
              <Typography variant="body1">{tip.content}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderFoodScraps = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Creative Uses for Food Scraps
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Don't throw away those scraps! Here are innovative ways to use parts of food you might normally discard.
      </Typography>
      
      <Grid container spacing={3}>
        {foodScrapsIdeas.map((idea, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h6">
                    {idea.title}
                  </Typography>
                  <Chip 
                    label={idea.category} 
                    size="small" 
                    color="primary" 
                    sx={{ my: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" component="div">
                    {idea.details}
                  </Typography>
                </CardContent>
              </Box>
              <CardMedia
                component="img"
                sx={{ width: '40%' }}
                image={idea.image}
                alt={idea.title}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return selectedRecipe ? renderRecipeDetail() : renderRecipeList();
      case 1:
        return renderPreservationTips();
      case 2:
        return renderMealPlanning();
      case 3:
        return renderFoodScraps();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Food Education Hub
      </Typography>
      
      <Typography variant="h6" paragraph color="text.secondary" align="center" sx={{ mb: 4 }}>
        Discover how to reduce food waste with recipes, preservation techniques, and meal planning strategies
      </Typography>
      
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="food education tabs"
        >
          <Tab icon={<RestaurantMenuIcon />} label="Recipes" />
          <Tab icon={<KitchenIcon />} label="Preservation" />
          <Tab icon={<SearchIcon />} label="Meal Planning" />
          <Tab icon={<NatureIcon />} label="Food Scraps" />
        </Tabs>
      </Paper>
      
      {renderTabContent()}
    </Container>
  );
};

export default FoodEducationHub;