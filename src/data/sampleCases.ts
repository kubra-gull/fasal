import { SampleCropCase } from '../types';

export const SAMPLE_CROP_CASES: SampleCropCase[] = [
  {
    id: 'tomato-late-blight',
    title: 'Tomato - Late Blight (ٹماٹر کا پچھیتا جھلسائو)',
    crop: 'Tomato',
    condition: 'Late Blight (Phytophthora infestans)',
    severity: 'Critical',
    status: 'Diseased',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80',
    description: 'Irregular dark brown water-soaked lesions with pale chlorotic halos on foliage and fruit rot.',
    defaultSymptoms: [
      'Large irregular water-soaked pale green/brown leaf lesions',
      'White fungal sporulation on undersides of leaves in humid mornings',
      'Dark sunken rot on green and ripe tomato fruits'
    ]
  },
  {
    id: 'wheat-yellow-rust',
    title: 'Wheat - Yellow Stripe Rust (گندم کی زرد کنگی)',
    crop: 'Wheat',
    condition: 'Stripe Rust (Puccinia striiformis)',
    severity: 'Severe',
    status: 'Diseased',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
    description: 'Distinct narrow linear stripes of bright yellow powdery fungal pustules along leaf blades.',
    defaultSymptoms: [
      'Linear stripes of bright yellow pustules along leaf veins',
      'Yellow powder stains fingers on touch',
      'Premature leaf senescence and pinched grains'
    ]
  },
  {
    id: 'potato-early-blight',
    title: 'Potato - Early Blight (آلو کا اگیتا جھلسائو)',
    crop: 'Potato',
    condition: 'Early Blight (Alternaria solani)',
    severity: 'Moderate',
    status: 'Diseased',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80',
    description: 'Characteristic target-board concentric dark circular spots surrounded by yellow margins on foliage.',
    defaultSymptoms: [
      'Concentric ring spots on mature lower leaves',
      'Chlorotic yellow ring around dark necrotic tissue',
      'Lower foliage drying out and dropping'
    ]
  },
  {
    id: 'cotton-leaf-curl',
    title: 'Cotton - Leaf Curl Virus (کپاس کا پتہ مروڑ وائرس)',
    crop: 'Cotton',
    condition: 'Cotton Leaf Curl Virus (CLCuV)',
    severity: 'Severe',
    status: 'Diseased',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=900&q=80',
    description: 'Severe upward leaf cupping, thickened dark green veins, enations, and stunted plant vigor.',
    defaultSymptoms: [
      'Upward and downward curling of top leaves',
      'Thickened primary veins on abaxial surface',
      'Severe stunting and reduced floral bud retention'
    ]
  },
  {
    id: 'onion-storage-black-mold',
    title: 'Onion - Post-Harvest Black Mold (پیاز کی کالی پھپھوندی)',
    crop: 'Onion',
    condition: 'Storage Black Mold & Neck Rot (Aspergillus niger)',
    severity: 'Critical',
    status: 'Post-Harvest Spoilage',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80',
    description: 'Black powdery fungal mold between bulb scales and rotting neck in storage godowns.',
    defaultSymptoms: [
      'Black soot-like powdery mold along outer dry scales',
      'Soft neck tissues yielding brown liquid',
      'Rapid rotting in stacked storage bins'
    ]
  },
  {
    id: 'maize-fall-armyworm',
    title: 'Maize - Fall Armyworm (مکئی کا فال آرمی ورم)',
    crop: 'Maize / Corn',
    condition: 'Fall Armyworm Infestation (Spodoptera frugiperda)',
    severity: 'Critical',
    status: 'Pest Damage',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80',
    description: 'Ragged shot-hole feeding damage on leaves and sawdust-like frass inside central whorls.',
    defaultSymptoms: [
      'Ragged skeletonized leaf perforations',
      'Fecal frass plugs in central leaf funnel',
      'Dead heart formation in young vegetative maize'
    ]
  },
  {
    id: 'healthy-crop-apple',
    title: 'Apple - Healthy Foliage & Orchard (صحت مند باغ)',
    crop: 'Apple',
    condition: 'Healthy Plant Tissue (No Pathogen Detected)',
    severity: 'None',
    status: 'Healthy',
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=900&q=80',
    description: 'Vibrant green glossy leaves, balanced chlorophyll, zero lesions, and robust orchard canopy.',
    defaultSymptoms: [
      'Even chlorophyll distribution with no chlorotic spots',
      'Smooth leaf margin without insect bites or curling',
      'Healthy vigor suitable for fruit maturation'
    ]
  }
];

export const AGRICULTURAL_CROPS = [
  'Auto-Detect (خودکار شناخت)',
  'Wheat (گندم)',
  'Rice / Paddy (دھان / چاول)',
  'Potato (آلو)',
  'Tomato (ٹماٹر)',
  'Cotton (کپاس)',
  'Maize / Corn (مکئی)',
  'Sugarcane (گنا)',
  'Soybean (سویا بین)',
  'Onion (پیاز)',
  'Chilli / Pepper (مرچ)',
  'Mustard / Rapeseed (سرسوں / رایا)',
  'Apple (سیب)',
  'Mango (آم)',
  'Citrus / Lemon (لیموں / کنو)',
  'Groundnut / Peanut (مونگ پھلی)',
  'Gram / Chickpea (چنا)',
  'Pulses / Lentils (دالیں)'
];

export const GROWTH_STAGES = [
  'All Stages / Not Sure',
  'Seedling & Germination',
  'Vegetative Growth',
  'Flowering & Budding',
  'Fruit / Pod / Grain Formation',
  'Maturity / Pre-Harvest',
  'Post-Harvest Storage & Warehousing'
];
