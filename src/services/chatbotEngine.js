/**
 * Guru HealthBot Intelligent Medical Engine
 * Built for Guru Medical & Healthcare (MR. Rushikesh Suresh Mante)
 * Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana (8237729148)
 *
 * Provides comprehensive, clinically validated, patient-friendly guidance on:
 * • ANY MEDICINE (Uses, mechanism, adult & pediatric doses, timings, food relation, max daily limits, precautions)
 * • ALL SICKNESSES & DISEASES (Simple explanations, causes, symptoms, home care, treatment protocols, and red flags)
 * • ALL TYPES OF PAINS (Headache, stomach pain, joint & knee pain, back pain, toothache, chest triage)
 * • LIVE INVENTORY INTEGRATION (One-click Add to Cart & WhatsApp Quick Orders)
 * • BILINGUAL SUPPORT (English & Marathi मराठी)
 */

import { MEDICINE_DOSAGE_BASE, SICKNESS_KNOWLEDGE_BASE, PAIN_KNOWLEDGE_BASE } from './medicalKnowledge.js';

// Helper: Detect Marathi script or common Marathi words
export const isMarathiQuery = (text = '') => {
  const marathiRegex = /[\u0900-\u097F]/;
  if (marathiRegex.test(text)) return true;
  const marathiPhonetics = [
    'namaskar', 'dada', 'bhau', 'ahe', 'aahe', 'kiti', 'kuthe', 'dava', 'aushadh',
    'tap', 'khokla', 'sardi', 'pota', 'dokyache', 'kambar', 'gudgha', 'doke', 'dolar',
    'jiv', 'chakkar', 'julab', 'ulti', 'ghasa', 'ras', 'marathi', 'sang'
  ];
  const lower = text.toLowerCase();
  return marathiPhonetics.some(word => lower.includes(word));
};

// Emergency keywords requiring immediate emergency triage
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'cardiac arrest', 'cannot breathe', 'difficulty breathing',
  'breathless', 'unconscious', 'passed out', 'fainted', 'snake bite', 'snakebite',
  'severe bleeding', 'poison', 'poisoning', 'suicide', 'stroke', 'paralysis',
  'severe burn', 'fits', 'convulsion', 'heavy blood loss',
  // Marathi emergency terms
  'छातीत दुखणे', 'हार्ट अटॅक', 'श्वास घेण्यास त्रास', 'बेशुद्ध', 'सर्पदंश', 'साप चावला',
  'रक्तस्राव', 'विष', 'स्ट्रोक', 'फिट येणे', 'श्वास गुदमरणे'
];

/**
 * Main Message Processing Pipeline
 */
export const processChatMessage = (userMessage, context = {}) => {
  const {
    medicines = [],
    orders = [],
    storeDetails = {},
    currentUser = {},
    preferredLanguage = 'en'
  } = context;

  const rawText = (userMessage || '').trim();
  const lower = rawText.toLowerCase();
  const useMarathi = preferredLanguage === 'mr' || isMarathiQuery(rawText);

  // -------------------------------------------------------------
  // 1. CRITICAL EMERGENCY TRIAGE
  // -------------------------------------------------------------
  const isEmergency = EMERGENCY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
  if (isEmergency) {
    if (useMarathi) {
      return {
        text: `⚠️ **तातडीचा वैद्यकीय इशारा (Critical Emergency Medical Alert):**\n\nआपण नमूद केलेली लक्षणे अत्यंत गंभीर असू शकतात. घरगुती उपचारांची वाट न पाहता **ताबडतोब वैद्यकीय मदत घ्या!**\n\n🚨 **तातडीने पुढील पावले उचला:**\n• **ऋषिकेश सुरेश मान्ते (गुरु मेडिकल 24/7):** [8237729148](tel:8237729148)\n• **सरकारी रुग्णवाहिका (National Ambulance):** [108](tel:108) / [102](tel:102)\n• जवळच्या प्राथमिक आरोग्य केंद्रात (PHC) किंवा सिंदखेड राजा / जालन्यातील हॉस्पिटलमध्ये त्वरित जा.\n\n*रुग्णाला शांत ठेवा, गर्दी करू नका आणि तात्काळ डॉक्टरांशी संपर्क साधा.*`,
        isEmergency: true,
        quickReplies: ['📞 फोन करा: 8237729148', '🏪 दुकानाचा पत्ता', 'इतर मदत']
      };
    }

    return {
      text: `⚠️ **CRITICAL EMERGENCY MEDICAL ALERT:**\n\nThe symptoms you described may require immediate clinical intervention. **Do not delay or attempt self-medication!**\n\n🚨 **Immediate Action Steps:**\n• **Call Mr. Rushikesh Mante (Guru Medical 24x7):** [8237729148](tel:8237729148)\n• **National Emergency Ambulance:** [108](tel:108) / [102](tel:102)\n• Visit the nearest Hospital or PHC in Sindkhed Raja or Sawkhed Tejan immediately.\n\n*Keep the patient calm, seated upright, and seek qualified emergency care without delay.*`,
      isEmergency: true,
      quickReplies: ['Call Hotline: 8237729148', 'Store Location', 'Browse Catalog']
    };
  }

  // -------------------------------------------------------------
  // 2. GREETINGS & COMPREHENSIVE BOT INTRODUCTION
  // -------------------------------------------------------------
  const greetingRegex = /^(hi|hello|hey|namaste|ram ram|shubh prabhat|good morning|good evening|pranam|नमस्कार|राम राम|हाय|हॅलो)$/i;
  if (greetingRegex.test(lower) || (lower.length < 15 && /^(hi|hello|hey|namaste)/i.test(lower))) {
    if (useMarathi) {
      return {
        text: `नमस्कार **${currentUser.name || 'मित्र'}**! 🙏\n\nमी **गुरु स्वास्थ्य मित्र (Guru HealthBot)** आहे — **गुरु मेडिकल & हेल्थकेअर (MR. Rushikesh Suresh Mante, सावखेड तेजन)** चा डिजिटल आरोग्य सहाय्यक.\n\nमी तुम्हाला पुढील सर्व विषयांवर परिपूर्ण व सोपी माहिती देऊ शकतो:\n• 💊 **कोणत्याही औषधाची माहिती व अचूक डोस:** (उदा. गोळी जेवणाआधी की नंतर, प्रौढ व बालकांचा डोस, दिवसातून किती वेळा)\n• 🤒 **सर्व आजार व लक्षणे समजून घेणे:** (उदा. ताप, सर्दी, खोकला, डेंग्यू, ॲसिडिटी, जुलाब, मधुमेह, बीपी)\n• ⚡ **सर्व प्रकारच्या वेदना व दुखण्यावर उपाय:** (उदा. डोकेदुखी, पोटदुखी, कंबरदुखी, गुडघेदुखी, दातदुखी)\n• 📦 **ऑर्डर ट्रॅकिंग व मोफत होम डिलिव्हरी**\n• 📄 **प्रिस्क्रिप्शन तपासणी व व्हॉट्सॲप ऑर्डर**\n\nखालीलपैकी एका विषयावर क्लिक करा किंवा आपला प्रश्न थेट टाइप करा:`,
        quickReplies: [
          '💊 औषधांचा योग्य डोस',
          '🤒 ताप व अंगदुखी',
          '🔥 ॲसिडिटी व गॅस',
          '🦵 गुडघे व पाठदुखी',
          '📦 ऑर्डर ट्रॅक करा',
          '🏪 दुकानाची वेळ व पत्ता'
        ]
      };
    }

    return {
      text: `Hello **${currentUser.name || 'there'}**! Welcome to **Guru Medical & Healthcare** 🙏\n\nI am **Guru HealthBot**, your AI pharmacy and clinical companion managed by **Mr. Rushikesh Suresh Mante** (Registered Pharmacist, Sawkhed Tejan).\n\nI can assist you with comprehensive, patient-friendly guidance on:\n• 💊 **Any Medicine Uses & Dosages:** (Before/after meals, adult & child guidelines, safe limits, side effects)\n• 🤒 **Understanding Any Sickness & Disease:** (Fever, cough, cold, dengue, typhoid, acidity, diabetes, BP, diarrhea)\n• ⚡ **Pain Management for All Pains:** (Headache, stomach cramps, back pain, knee arthritis, toothache, muscle strain)\n• 📦 **Live Delivery Tracking & Village Home Delivery**\n• 📄 **Doctor Prescription Upload & WhatsApp Orders**\n\nClick any topic below or type your health question directly:`,
      quickReplies: [
        '💊 Medicine Dosage Guide',
        '🤒 Fever & Viral Sickness',
        '🔥 Acidity & Gas Relief',
        '🦵 Joint & Back Pain',
        '📦 Track My Order',
        '🏪 Store Hours & Contact'
      ]
    };
  }

  // -------------------------------------------------------------
  // 3. ORDER TRACKING INTENT
  // -------------------------------------------------------------
  const orderIdMatch = rawText.match(/ORD[- ]?(\d+)/i) || rawText.match(/\b(\d{4})\b/);
  const isOrderQuery = /order|track|delivery|status|कुठे|ऑर्डर|ट्रॅक|पार्सल/i.test(lower);

  if (orderIdMatch || (isOrderQuery && !lower.includes('medicine') && !lower.includes('fever') && !lower.includes('pain'))) {
    let matchedOrder = null;

    if (orderIdMatch) {
      const searchNum = orderIdMatch[1];
      matchedOrder = orders.find(o => o.id.toLowerCase().includes(searchNum.toLowerCase()));
    } else if (currentUser.phone) {
      matchedOrder = orders.find(o => o.customerPhone === currentUser.phone || o.customerName?.toLowerCase().includes(currentUser.name?.toLowerCase()));
    }

    if (matchedOrder) {
      const itemsList = matchedOrder.items.map(it => `• ${it.name} (x${it.quantity}) - ₹${(it.price * it.quantity).toFixed(2)}`).join('\n');
      if (useMarathi) {
        return {
          text: `📦 **ऑर्डर थेट ट्रॅकिंग तपशील सापडला:**\n\n• **ऑर्डर आयडी:** \`${matchedOrder.id}\`\n• **सध्याची स्थिती:** **${matchedOrder.status}**\n• **ग्राहक:** ${matchedOrder.customerName}\n• **डिलिव्हरी पत्ता:** ${matchedOrder.deliveryAddress}\n• **एकूण रक्कम:** ₹${matchedOrder.totalAmount.toFixed(2)} (${matchedOrder.paymentMethod})\n\n**या पार्सलमध्ये असलेली औषधे:**\n${itemsList}\n\n${matchedOrder.notes ? `*टीप: ${matchedOrder.notes}*` : ''}\n\nसावखेड तेजन व लगतच्या गावांमध्ये आम्ही वेळेवर डिलिव्हरी देतो! काही अडचण असल्यास श्री. ऋषिकेश मान्ते यांना **8237729148** वर कॉल करू शकता.`,
          matchedOrder,
          quickReplies: ['दुसरे औषध शोधा', 'डिलिव्हरी माहिती', 'प्रिस्क्रिप्शन पाठवा']
        };
      }

      return {
        text: `📦 **Live Order Tracking Details:**\n\n• **Order ID:** \`${matchedOrder.id}\`\n• **Current Status:** **${matchedOrder.status}**\n• **Customer:** ${matchedOrder.customerName} (${matchedOrder.customerPhone})\n• **Delivery Location:** ${matchedOrder.deliveryAddress}\n• **Total Payable:** ₹${matchedOrder.totalAmount.toFixed(2)} (${matchedOrder.paymentMethod})\n\n**Medicines in this parcel:**\n${itemsList}\n\n${matchedOrder.notes ? `*Delivery note: ${matchedOrder.notes}*` : ''}\n\nNeed urgent changes? Call Mr. Rushikesh Mante on **8237729148** anytime.`,
        matchedOrder,
        quickReplies: ['Track Another Order', 'Browse Catalog', 'Store Timings']
      };
    } else if (isOrderQuery) {
      const userOrders = orders.filter(o => o.customerPhone === currentUser.phone || !currentUser.phone);
      if (userOrders.length > 0) {
        const orderChips = userOrders.slice(0, 3).map(o => `Track ${o.id}`);
        return {
          text: useMarathi
            ? `आपल्याकडे नुकत्याच नोंदवलेल्या खालील ऑर्डर्स आहेत. कृपया ट्रॅक करण्यासाठी ऑर्डर क्रमांकावर क्लिक करा किंवा आयडी टाइप करा:`
            : `Here are your recent store orders. Click an order number below or type your Order ID:`,
          quickReplies: orderChips
        };
      }

      return {
        text: useMarathi
          ? `कृपया तुमचा ४-अंकी ऑर्डर क्रमांक (उदा. \`ORD-9021\`) पाठवा, मी त्याची थेट डिलिव्हरी स्थिती लगेच तपासून सांगतो.`
          : `Please provide your Order ID (e.g. \`ORD-9021\`) so I can retrieve live delivery status for you.`,
        quickReplies: ['ORD-9021', 'सर्व औषधे पहा', 'दुकानाची वेळ']
      };
    }
  }

  // -------------------------------------------------------------
  // 4. PRESCRIPTION QUESTIONS & UPLOAD INTENT
  // -------------------------------------------------------------
  const rxKeywords = ['prescription', 'upload', 'doctor slip', 'rx', 'प्रिस्क्रिप्शन', 'डॉक्टर', 'कागद', 'चिट्ठी', 'अपलोड'];
  if (rxKeywords.some(kw => lower.includes(kw)) && !lower.includes('dose') && !lower.includes('pain') && !lower.includes('fever')) {
    if (useMarathi) {
      return {
        text: `📄 **डॉक्टरांचे प्रिस्क्रिप्शन कसे पाठवायचे व औषधे कशी मिळवायची?**\n\nभारतीय औषध नियमावलीनुसार (Schedule H/H1), अँटिबायोटिक्स, बीपी, मधुमेह आणि हृदयाच्या औषधांसाठी वैध डॉक्टरांचे प्रिस्क्रिप्शन आवश्यक असते.\n\n✅ **प्रिस्क्रिप्शन पाठवण्याचे २ सोपे मार्ग:**\n1. **वेबसाइटवर थेट अपलोड करा:** खाली दिलेल्या बटणावर क्लिक करून मोबाईल कॅमेरा किंवा गॅलरीतून फोटो अपलोड करा.\n2. **व्हॉट्सॲपवर पाठवा:** **8237729148** या नंबरवर प्रिस्क्रिप्शनचा स्पष्ट फोटो पाठवा, फार्मासिस्ट ऋषिकेश मान्ते स्वतः औषधे पॅक करून देतील.\n\n🚚 **सावखेड तेजन व परिसरातील सर्व खेड्यांमध्ये २ तासांत मोफत होम डिलिव्हरी उपलब्ध!**`,
        action: { type: 'open_prescription_modal', label: '📄 आता प्रिस्क्रिप्शन अपलोड करा' },
        quickReplies: ['📄 प्रिस्क्रिप्शन अपलोड करा', 'WhatsApp वर पाठवा', 'औषधांचा साठा तपासा']
      };
    }

    return {
      text: `📄 **Doctor Prescription Verification & Fast Dispatch:**\n\nAs per Central Drugs Standard Control Organization (CDSCO) regulations, valid prescriptions from a Registered Medical Practitioner (RMP) are required for Schedule H/H1 medicines (Antibiotics, Cardiac, Blood Pressure & Diabetes drugs).\n\n✅ **2 Easy Submission Methods:**\n1. **Upload via Portal:** Click the upload button below to take a photo or select an image from your device.\n2. **Send via WhatsApp:** Message your doctor's slip directly to Registered Pharmacist **Mr. Rushikesh Mante** at [8237729148](https://wa.me/918237729148).\n\n🚚 **Free 2-hour doorstep delivery across Sawkhed Tejan, Sindkhed Raja, and surrounding villages!**`,
      action: { type: 'open_prescription_modal', label: '📄 Upload Prescription Now' },
      quickReplies: ['Upload Prescription', 'WhatsApp Prescription', 'Browse Catalog']
    };
  }

  // -------------------------------------------------------------
  // 5. STORE DETAILS, LOCATION, TIMINGS & FREE COUNTER SERVICES
  // -------------------------------------------------------------
  const storeKeywords = ['timing', 'timings', 'time', 'open', 'close', 'address', 'location', 'where', 'phone', 'contact', 'rushikesh', 'owner', 'वेळ', 'पत्ता', 'दुकान', 'कुठे', 'फोन', 'नंबर', 'सावखेड'];
  if (storeKeywords.some(kw => lower.includes(kw)) && !lower.includes('medicine') && !lower.includes('tablet') && !lower.includes('dose') && !lower.includes('fever') && !lower.includes('pain')) {
    if (useMarathi) {
      return {
        text: `🏪 **गुरु मेडिकल & हेल्थकेअर — दुकानाची माहिती व पत्ता:**\n\n• **मालक व फार्मासिस्ट:** श्री. ऋषिकेश सुरेश मान्ते (D.Pharm, B.Pharm)\n• **पत्ता:** सावखेड तेजन, ता. सिंदखेड राजा, जि. बुलढाणा - 443308 (ग्रामपंचायत कार्यालयाजवळ, मुख्य रस्ता)\n• **दुकानाची वेळ:** दररोज सकाळी 7:30 ते रात्री 10:30\n• **24/7 इमर्जन्सी सेवा:** रात्रीच्या आपत्कालीन औषधांसाठी **8237729148** वर कधीही कॉल करू शकता\n• **ड्रग लायसन्स क्र.:** MH-BUL-20B-194821 / 21B-194822\n\n🩺 **काउंटरवर मोफत आरोग्य तपासणी:**\n  - डिजिटल ब्लड प्रेशर (BP) तपासणी\n  - इन्स्टंट रक्तातील साखर (Blood Sugar) तपासणी\n  - ऑक्सिजन लेव्हल (SpO2) व वजन तपासणी`,
        quickReplies: ['📞 फोन करा: 8237729148', '💊 औषधे शोधा', '📄 प्रिस्क्रिप्शन पाठवा']
      };
    }

    return {
      text: `🏪 **Guru Medical & Healthcare — Store Directory:**\n\n• **Proprietor & Pharmacist:** MR. Rushikesh Suresh Mante (D.Pharm, B.Pharm)\n• **Address:** Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana, Maharashtra - 443308\n• **Landmark:** Near Gram Panchayat Office, Main Road\n• **Operating Hours:** Daily 7:30 AM – 10:30 PM\n• **24x7 Emergency Line:** [8237729148](tel:8237729148) (Always available for nighttime emergencies)\n• **Drug License:** MH-BUL-20B-194821 / 21B-194822\n\n🩺 **Free Health Checkups at Store Counter:**\n  - Digital Blood Pressure (BP) Monitoring\n  - Accu-Chek Blood Sugar Testing\n  - Pulse Oximeter (SpO2) & Weight Tracking`,
      quickReplies: ['Call Pharmacist', 'Browse Catalog', 'Upload Prescription']
    };
  }

  // -------------------------------------------------------------
  // 6. SPECIFIC MEDICINE & DOSAGE INQUIRY PIPELINE
  // -------------------------------------------------------------
  // Detect if user is asking about a specific medicine or dose
  const matchedMedicineGuide = findMedicineGuide(lower);
  const isDoseQuery = /dose|dosage|how to take|when to take|how many|timing|food|empty stomach|before food|after food|डोस|कसा घ्यावा|कधी घ्यावा|किती गोळी|जेवणाआधी|जेवणानंतर/i.test(lower);

  if (matchedMedicineGuide) {
    const medGuide = matchedMedicineGuide;
    const inventoryMatches = findInventoryMatches(medGuide.matchedStoreNames || [medGuide.generic], medicines);

    if (useMarathi) {
      return {
        text: `📋 **${medGuide.popularBrands[0] || medGuide.generic} — औषधाचा परिपूर्ण तपशील व डोस:**\n\n` +
          `• **घटक (Generic):** ${medGuide.generic}\n` +
          `• **प्रकार:** ${medGuide.category} (${medGuide.prescriptionRequired ? 'प्रिस्क्रिप्शन आवश्यक 📄' : 'ओटीसी / सुरक्षित 🟢'})\n` +
          `• **कशासाठी वापरतात:** ${medGuide.purposeMr}\n` +
          `• **शरीरावर कसा कार्य करतो:** ${medGuide.howItWorksMr}\n\n` +
          `💊 **रुग्णासाठी सोप्या भाषेतील अचूक डोस (Dosage Guide):**\n${medGuide.adultDoseMr}\n\n` +
          `👶 **लहान मुलांसाठी सूचना:**\n${medGuide.pediatricDoseMr}\n\n` +
          `⚠️ **महत्त्वाची काळजी व पथ्य:**\n${medGuide.precautionsMr}\n\n` +
          `*टीप: अचूक वैद्यकीय सल्ल्यासाठी किंवा दीर्घकालीन आजारांसाठी फार्मासिस्ट ऋषिकेश मान्ते (8237729148) किंवा डॉक्टरांचा सल्ला घ्यावा.*`,
        matchedMedicines: inventoryMatches,
        quickReplies: [
          inventoryMatches[0] ? `Add ${inventoryMatches[0].name.split(' ')[0]} to Cart` : 'कार्टमध्ये टाका',
          'दुसऱ्या औषधाचा डोस विचारा',
          'ऋषिकेश मान्ते यांना विचारा'
        ]
      };
    }

    return {
      text: `📋 **${medGuide.popularBrands[0] || medGuide.generic} — Complete Patient Medicine & Dosage Guide:**\n\n` +
        `• **Active Formulation (Generic):** ${medGuide.generic}\n` +
        `• **Therapeutic Class:** ${medGuide.category} (${medGuide.prescriptionRequired ? 'Prescription Required (Rx)' : 'Over-the-Counter (OTC)'})\n` +
        `• **Primary Uses:** ${medGuide.purposeEn}\n` +
        `• **How It Works in Body:** ${medGuide.howItWorksEn}\n\n` +
        `💊 **Patient Dosage & Administration (Easy to Understand):**\n${medGuide.adultDoseEn}\n\n` +
        `👶 **Pediatric (Children) Guidance:**\n${medGuide.pediatricDoseEn}\n\n` +
        `⚠️ **Safety Warnings & Precautions:**\n${medGuide.precautionsEn}\n\n` +
        `*Note: For chronic conditions or specific dosage adjustments, consult Pharmacist Mr. Rushikesh Mante (8237729148) or your treating physician.*`,
      matchedMedicines: inventoryMatches,
      quickReplies: [
        inventoryMatches[0] ? `Add ${inventoryMatches[0].name.split(' ')[0]} to Cart` : 'Add to Cart',
        'Ask About Another Medicine',
        'Consult Pharmacist'
      ]
    };
  }

  // -------------------------------------------------------------
  // 6.5 PEDIATRIC & CHILD DOSAGE SAFETY PROTOCOL
  // -------------------------------------------------------------
  const isPediatric = lower.includes('child') || lower.includes('kid') || lower.includes('baby') || lower.includes('pediatric') || lower.includes('लहान') || lower.includes('बाळ');
  if (isPediatric && (lower.includes('dose') || lower.includes('fever') || lower.includes('ताप') || lower.includes('डोस') || lower.includes('medicine') || lower.includes('औषध'))) {
    if (useMarathi) {
      return {
        text: `👶 **लहान मुलांच्या औषधांविषयी अत्यंत महत्त्वाची सुरक्षा सूचना व डोस नियम:**\n\n` +
          `• ⚠️ **कधीही मोठ्यांच्या गोळ्या लहान मुलांना देऊ नका!** (उदा. प्रौढांची ६५० मिग्रॅ गोळी मुलांच्या यकृतावर विषारी परिणाम करू शकते).\n` +
          `• **नेहमी बालरोग सिरप वापरा:** लहान मुलांसाठी पॅरासिटामॉल सिरप (उदा. Calpol 120mg/5ml किंवा 250mg/5ml) वापरावे.\n` +
          `• **डोस कसा ठरतो?** डोस हा वयापेक्षा मुलांच्या **वजनानुसार (10-15 मिग्रॅ प्रति किलो वजन)** ठरतो.\n` +
          `• **दोन डोसमधील अंतर:** किमान ६ तासांचे अंतर ठेवावे (२४ तासांत जास्तीत जास्त ४ वेळा).\n` +
          `• **माप:** सिरपसोबत येणारा मापाचा चमचा किंवा सिरिंजच वापरावी; घरातील साधा चमचा वापरू नका.\n\n` +
          `तुमच्या बाळाचे नेमके वय व वजन सांगून अचूक सिरप व डोस जाणून घेण्यासाठी फार्मासिस्ट श्री. ऋषिकेश मान्ते यांना **8237729148** वर थेट कॉल करा.`,
        quickReplies: ['बालकांचा ताप सिरप', 'खोकल्याचे सिरप', 'कॉल करा: 8237729148']
      };
    }

    return {
      text: `👶 **Critical Pediatric (Children) Medication Safety & Dosing Protocol:**\n\n` +
        `• ⚠️ **NEVER give adult-strength tablets to children!** Adult 650mg doses can cause severe toxicity to a child's liver and kidneys.\n` +
        `• **Always use Pediatric Suspensions/Drops:** For fever/pain, use Paracetamol pediatric syrup (e.g., Calpol 120mg/5ml or 250mg/5ml).\n` +
        `• **Weight-Based Dosing:** Dosages are calculated strictly by child's **Body Weight** (10 to 15 mg per kg per single dose).\n` +
        `• **Interval Between Doses:** Minimum 6 hours gap between doses (Maximum 4 doses in 24 hours).\n` +
        `• **Measuring Rule:** Always use the calibrated syringe or measuring cup provided with the bottle; never use household kitchen spoons.\n\n` +
        `To get the exact syrup formulation and weight-calculated dose for your child, please contact Pharmacist **Mr. Rushikesh Mante** on **[8237729148](tel:8237729148)** immediately.`,
      quickReplies: ['Pediatric Fever Syrups', 'Baby Cold Guidance', 'Call Pharmacist']
    };
  }

  // -------------------------------------------------------------
  // 7. ALL PAINS & PAIN RELIEF PIPELINE
  // -------------------------------------------------------------
  const matchedPainGuide = findPainGuide(lower);
  if (matchedPainGuide) {
    const pain = matchedPainGuide;
    const inventoryMatches = findInventoryMatches(pain.matchedMeds || [], medicines);

    if (useMarathi) {
      return {
        text: `⚡ **${pain.nameMr} — समजून घ्या आणि वेदनेवर आराम मिळवा:**\n\n` +
          `📖 **वेदना का होते? (कारण समजून घ्या):**\n${pain.explanationMr}\n\n` +
          `💊 **सुरक्षित औषधोपचार व डोस मार्गदर्शक:**\n${pain.remedyGuideMr}\n\n` +
          `🛡️ **घरगुती काळजी व पथ्य:**\n${pain.precautionsMr}\n\n` +
          `${pain.redFlagsMr}\n\n` +
          `*गुरु मेडिकल स्टोअर्समध्ये सर्व वेदनाशामक मलम, गोळ्या व गरम पाण्याच्या पिशव्या उपलब्ध आहेत.*`,
        matchedMedicines: inventoryMatches,
        quickReplies: [
          'Volini मलम तपासा',
          'Dolo 650 डोस',
          'ऋषिकेश मान्ते यांना कॉल करा'
        ]
      };
    }

    return {
      text: `⚡ **${pain.nameEn} — Comprehensive Relief & Patient Protocol:**\n\n` +
        `📖 **Understanding the Pain (Why it occurs):**\n${pain.explanationEn}\n\n` +
        `💊 **Safe Medical Relief & Dosage Protocol:**\n${pain.remedyGuideEn}\n\n` +
        `🛡️ **Daily Care & Non-Drug Measures:**\n${pain.precautionsEn}\n\n` +
        `${pain.redFlagsEn}\n\n` +
        `*All topical pain gels, warm compresses, and analgesics are available in store for immediate dispatch.*`,
      matchedMedicines: inventoryMatches,
      quickReplies: [
        'Add Pain Relief to Cart',
        'Check Paracetamol Dose',
        'Call Pharmacist'
      ]
    };
  }

  // -------------------------------------------------------------
  // 8. ALL SICKNESSES, DISEASES & INFECTIONS PIPELINE
  // -------------------------------------------------------------
  const matchedSicknessGuide = findSicknessGuide(lower);
  if (matchedSicknessGuide) {
    const sick = matchedSicknessGuide;
    const inventoryMatches = findInventoryMatches(sick.matchedMeds || [], medicines);

    if (useMarathi) {
      return {
        text: `🩺 **${sick.nameMr} — आजार समजून घ्या व उपचार मार्गदर्शन:**\n\n` +
          `📖 **आजार काय आहे? (सोप्या भाषेत):**\n${sick.explanationMr}\n\n` +
          `🔍 **मुख्य कारणे:** ${sick.commonCausesMr || 'ऋतू बदल, व्हायरल संसर्ग किंवा अस्वच्छता.'}\n\n` +
          `💊 **औषधे व अचूक डोस (Dosage for Patient):**\n${sick.dosageGuideMr}\n\n` +
          `🍵 **घरगुती काळजी, आहार व पथ्य:**\n${sick.homeCareMr}\n\n` +
          `${sick.redFlagsMr}\n\n` +
          `*औषधे घरपोच मागवण्यासाठी खालील कार्डवरून "Add to Cart" करा किंवा व्हॉट्सॲपवर सांगा.*`,
        matchedMedicines: inventoryMatches,
        quickReplies: [
          inventoryMatches[0] ? `Add ${inventoryMatches[0].name.split(' ')[0]} to Cart` : 'औषधे ऑर्डर करा',
          'घरगुती उपाय सांगा',
          'दुसऱ्या आजाराबद्दल विचारा'
        ]
      };
    }

    return {
      text: `🩺 **${sick.nameEn} — Clear Clinical Explanation & Patient Guide:**\n\n` +
        `📖 **What is happening in the body? (Simplified):**\n${sick.explanationEn}\n\n` +
        `🔍 **Common Triggers/Causes:** ${sick.commonCausesEn || 'Viral pathogen, weather transition, or microbial exposure.'}\n\n` +
        `💊 **Treatment Plan & Clear Patient Dosages:**\n${sick.dosageGuideEn}\n\n` +
        `🍵 **Home Care, Diet & Hydration Support:**\n${sick.homeCareEn}\n\n` +
        `${sick.redFlagsEn}\n\n` +
        `*You can add recommended medications directly to your order below or consult Pharmacist Mr. Rushikesh Mante.*`,
      matchedMedicines: inventoryMatches,
      quickReplies: [
        inventoryMatches[0] ? `Add ${inventoryMatches[0].name.split(' ')[0]} to Cart` : 'Add to Cart',
        'Dosage Rules for Kids',
        'Store Free Delivery'
      ]
    };
  }

  // -------------------------------------------------------------
  // 9. GENERAL INVENTORY SEARCH (MATCHING STORE MEDICINES)
  // -------------------------------------------------------------
  const liveMatchedMeds = searchLiveInventory(lower, medicines);
  if (liveMatchedMeds.length > 0) {
    const count = liveMatchedMeds.length;
    if (useMarathi) {
      return {
        text: `🔍 **आपल्या शोधानुसार ${count} औषध(े) गुरु मेडिकलमध्ये उपलब्ध आहेत:**\n\nखालील कार्ड्समधून आपण थेट औषधाचा साठा, किंमत, घटक व डोस पाहू शकता आणि **"Add to Cart"** किंवा व्हॉट्सॲपवर ऑर्डर करू शकता:\n\n*टीप: डॉक्टरांच्या सल्ल्यानुसारच योग्य डोस घ्यावा.*`,
        matchedMedicines: liveMatchedMeds,
        quickReplies: ['कार्ट तपासा', 'प्रिस्क्रिप्शन पाठवा', 'डोस कसा घ्यावा?']
      };
    }

    return {
      text: `🔍 **Found ${count} matching medicine(s) in our store inventory:**\n\nYou can review live stock, pricing, composition, and dosage instructions below, or click **"Add to Cart"** right now:\n\n*Note: Always adhere to the recommended dose and verify with our pharmacist.*`,
      matchedMedicines: liveMatchedMeds,
      quickReplies: ['View Cart', 'Upload Prescription', 'Ask About Dosage']
    };
  }

  // -------------------------------------------------------------
  // 10. INTELLIGENT GENERALIZED HEALTH & CLINICAL FALLBACK
  // -------------------------------------------------------------
  // Default patient-friendly educational fallback
  if (useMarathi) {
    return {
      text: `मी आपला प्रश्न समजण्याचा पूर्ण प्रयत्न केला: *" ${rawText} "*\n\nमी **गुरु स्वास्थ्य मित्र** म्हणून आपल्याला पुढील सर्व बाबींवर अचूक मार्गदर्शन करू शकतो:\n\n• 💊 **कोणत्याही औषधाचा डोस व वेळ:** उदा. \`Dolo 650 डोस\`, \`Pan D कसा घ्यावा\`, \`Azee 500\`, \`Telma 40\`, \`Glycomet\`\n• 🤒 **कोणताही आजार समजून घेणे:** उदा. \`ताप\`, \`सर्दी खोकला\`, \`डेंग्यू\`, \`टायफॉईड\`, \`ॲसिडिटी\`, \`जुलाब\`, \`मधुमेह\`, \`बीपी\`\n• ⚡ **सर्व प्रकारच्या वेदना व दुखणे:** उदा. \`डोकेदुखी\`, \`पोटदुखी\`, \`गुडघेदुखी\`, \`कंबरदुखी\`, \`दातदुखी\`\n• 📦 **ऑर्डर ट्रॅकिंग:** \`ORD-9021\`\n\nकिंवा थेट सावखेड तेजन येथील फार्मासिस्ट श्री. ऋषिकेश मान्ते यांना **8237729148** वर कॉल करू शकता!`,
      quickReplies: [
        '💊 औषधांचा योग्य डोस',
        '🤒 ताप व अंगदुखी',
        '🔥 ॲसिडिटी व गॅस',
        '🦵 गुडघे व सांधेदुखी',
        '📦 ऑर्डर ट्रॅक करा'
      ]
    };
  }

  return {
    text: `I want to give you the most accurate medical and pharmacy information regarding: *" ${rawText} "*\n\nAs **Guru HealthBot**, I can explain and guide you through:\n\n• 💊 **Any Medicine & Doses:** (e.g., \`Dolo 650 dosage\`, \`How to take Pan-D\`, \`Augmentin 625\`, \`Telma 40\`, \`Metformin\`, \`Cetirizine\`)\n• 🤒 **Understanding Any Sickness or Disease:** (e.g., \`Viral Fever\`, \`Cough & Cold\`, \`Dengue\`, \`Typhoid\`, \`Acidity & GERD\`, \`Diarrhea\`, \`Diabetes\`, \`High BP\`)\n• ⚡ **Relief for All Pains:** (e.g., \`Headache & Migraine\`, \`Stomach Cramps\`, \`Knee & Joint Pain\`, \`Back Pain\`, \`Toothache\`)\n• 📦 **Live Delivery Tracking:** (e.g., \`ORD-9021\`)\n\nYou can also call Registered Pharmacist **Mr. Rushikesh Mante** directly on **8237729148** for personal advice!`,
    quickReplies: [
      '💊 Medicine Dosage Guide',
      '🤒 Fever & Viral Care',
      '🔥 Acidity & Heartburn',
      '🦵 Knee & Back Pain',
      '📦 Track My Order'
    ]
  };
};

// -------------------------------------------------------------
// HELPER MATCHING FUNCTIONS
// -------------------------------------------------------------

/**
 * Match medicine from comprehensive repository with space/hyphen normalization
 */
function findMedicineGuide(query) {
  const q = query.toLowerCase();
  const qClean = q.replace(/[-\s]/g, '');

  for (const item of MEDICINE_DOSAGE_BASE) {
    const idClean = item.id.replace(/[_-\s]/g, '');
    if (q.includes(item.id.replace('_', ' ')) || qClean.includes(idClean)) return item;

    if (item.popularBrands.some(brand => {
      const bLower = brand.toLowerCase();
      const bClean = bLower.replace(/[-\s]/g, '');
      return q.includes(bLower) || qClean.includes(bClean);
    })) return item;

    // Check parts of generic
    const genericParts = item.generic.toLowerCase().split(/[\s+/(),-]+/).filter(w => w.length > 3);
    if (genericParts.some(part => q.includes(part))) return item;
  }
  return null;
}

/**
 * Match sickness / disease prioritizing longest keyword match
 */
function findSicknessGuide(query) {
  const q = query.toLowerCase();
  let bestMatch = null;
  let maxKeywordLength = 0;

  for (const item of SICKNESS_KNOWLEDGE_BASE) {
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();
      if (q.includes(kwLower)) {
        if (kwLower.length > maxKeywordLength) {
          maxKeywordLength = kwLower.length;
          bestMatch = item;
        }
      }
    }
  }
  return bestMatch;
}

/**
 * Match pain query prioritizing longest keyword match
 */
function findPainGuide(query) {
  const q = query.toLowerCase();
  let bestMatch = null;
  let maxKeywordLength = 0;

  for (const item of PAIN_KNOWLEDGE_BASE) {
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();
      if (q.includes(kwLower)) {
        if (kwLower.length > maxKeywordLength) {
          maxKeywordLength = kwLower.length;
          bestMatch = item;
        }
      }
    }
  }
  return bestMatch;
}

/**
 * Find matching medicines from live store inventory based on recommended names
 */
function findInventoryMatches(targetNames = [], medicines = []) {
  if (!targetNames || targetNames.length === 0) return [];
  const matched = [];
  const ids = new Set();

  for (const target of targetNames) {
    const tLower = target.toLowerCase();
    for (const med of medicines) {
      if (ids.has(med.id)) continue;
      const mName = med.name.toLowerCase();
      const mGen = med.genericName.toLowerCase();
      if (mName.includes(tLower) || tLower.includes(mName.split(' ')[0].toLowerCase()) || mGen.includes(tLower)) {
        matched.push(med);
        ids.add(med.id);
      }
    }
  }

  return matched.slice(0, 4);
}

/**
 * General keyword search over live store inventory
 */
function searchLiveInventory(query, medicines) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);

  const matched = medicines.filter(m => {
    const name = m.name.toLowerCase();
    const generic = m.genericName.toLowerCase();
    const category = m.category.toLowerCase();

    if (name.includes(q) || generic.includes(q) || category.includes(q)) return true;
    return words.some(w => name.includes(w) || generic.includes(w));
  });

  return matched.slice(0, 4);
}
