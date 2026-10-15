import type { EligibilityAnswers, L10n } from "@/lib/types";

export type DocId = "aadhaar" | "bank" | "mobile" | "ration" | "photo" | "work90" | "age";

export const DOCS: Record<DocId, { name: L10n; hint: L10n }> = {
  aadhaar: {
    name: { en: "Aadhaar card", hi: "आधार कार्ड", mr: "आधार कार्ड" },
    hint: { en: "Keep the original with you, give only a photocopy", hi: "असली अपने पास रखें, सिर्फ़ फ़ोटोकॉपी दें", mr: "मूळ स्वतःकडे ठेवा, फक्त झेरॉक्स द्या" },
  },
  bank: {
    name: { en: "Bank passbook", hi: "बैंक पासबुक", mr: "बँक पासबुक" },
    hint: { en: "The first page with your name and account number", hi: "पहला पन्ना जिस पर नाम और खाता नंबर हो", mr: "नाव आणि खाते क्रमांक असलेले पहिले पान" },
  },
  mobile: {
    name: { en: "Mobile linked to Aadhaar", hi: "आधार से जुड़ा मोबाइल", mr: "आधारशी जोडलेला मोबाइल" },
    hint: { en: "OTP comes on this number", hi: "OTP इसी नंबर पर आता है", mr: "OTP याच नंबरवर येतो" },
  },
  ration: {
    name: { en: "Ration card", hi: "राशन कार्ड", mr: "रेशन कार्ड" },
    hint: { en: "Works in any state with One Nation One Ration Card", hi: "एक देश एक राशन कार्ड से हर राज्य में चलता है", mr: "एक देश एक रेशन कार्डमुळे सगळ्या राज्यांत चालते" },
  },
  photo: {
    name: { en: "Passport-size photo", hi: "पासपोर्ट साइज़ फ़ोटो", mr: "पासपोर्ट साइज फोटो" },
    hint: { en: "2 copies are enough", hi: "2 फ़ोटो काफ़ी हैं", mr: "2 फोटो पुरेसे" },
  },
  work90: {
    name: { en: "90-day work certificate", hi: "90 दिन काम का प्रमाणपत्र", mr: "90 दिवस कामाचे प्रमाणपत्र" },
    hint: { en: "From your contractor — your RozGhar Khata helps prove the days", hi: "ठेकेदार से — आपका रोज़घर खाता दिन साबित करने में मदद करता है", mr: "ठेकेदाराकडून — तुमचा नाका खाता दिवस दाखवायला मदत करतो" },
  },
  age: {
    name: { en: "Age proof", hi: "उम्र का प्रमाण", mr: "वयाचा पुरावा" },
    hint: { en: "School certificate, Aadhaar or voter ID", hi: "स्कूल सर्टिफ़िकेट, आधार या वोटर आईडी", mr: "शाळेचा दाखला, आधार किंवा मतदार ओळखपत्र" },
  },
};

export interface Scheme {
  id: string;
  name: L10n;
  short: L10n;
  benefit: L10n;
  who: L10n;
  get: L10n;
  where: L10n;
  docs: DocId[];
  helpline?: string;
  kind: "id" | "pension" | "welfare" | "health" | "insurance" | "loan" | "ration" | "bank";
  /** Returns a reason when this scheme fits the answers, else null. */
  fits: (a: EligibilityAnswers) => L10n | null;
}

export const SCHEMES: Scheme[] = [
  {
    id: "jandhan",
    kind: "bank",
    name: { en: "Jan Dhan bank account", hi: "जन धन बैंक खाता", mr: "जन धन बँक खाते" },
    short: { en: "Free bank account — needed for most schemes", hi: "मुफ़्त बैंक खाता — ज़्यादातर योजनाओं के लिए ज़रूरी", mr: "मोफत बँक खाते — बहुतेक योजनांसाठी गरजेचे" },
    benefit: { en: "Zero-balance account", hi: "ज़ीरो बैलेंस खाता", mr: "शून्य शिल्लक खाते" },
    who: { en: "Anyone without a bank account", hi: "जिसका बैंक खाता नहीं है", mr: "ज्यांचे बँक खाते नाही असे कोणीही" },
    get: { en: "A zero-balance savings account with a RuPay card. Pay and government money come straight to you.", hi: "रुपे कार्ड के साथ ज़ीरो बैलेंस खाता। मज़दूरी और सरकारी पैसा सीधे आपके खाते में।", mr: "रुपे कार्डसह शून्य शिल्लक खाते. मजुरी आणि सरकारी पैसे थेट तुमच्या खात्यात." },
    where: { en: "Any bank branch or bank mitra near you", hi: "किसी भी बैंक शाखा या बैंक मित्र के पास", mr: "कोणत्याही बँक शाखेत किंवा बँक मित्राकडे" },
    docs: ["aadhaar", "photo"],
    fits: (a) =>
      a.bank === "no"
        ? { en: "You said you don't have a bank account — start here", hi: "आपने बताया कि बैंक खाता नहीं है — पहले यह खोलें", mr: "तुम्ही सांगितले बँक खाते नाही — आधी हे उघडा" }
        : null,
  },
  {
    id: "eshram",
    kind: "id",
    name: { en: "e-Shram card", hi: "ई-श्रम कार्ड", mr: "ई-श्रम कार्ड" },
    short: { en: "Free worker ID that opens other schemes", hi: "मुफ़्त मज़दूर पहचान पत्र, बाकी योजनाओं का दरवाज़ा", mr: "मोफत कामगार ओळखपत्र, इतर योजनांचा दरवाजा" },
    benefit: { en: "Free · 12-digit UAN", hi: "मुफ़्त · 12 अंकों का UAN", mr: "मोफत · 12 अंकी UAN" },
    who: { en: "Unorganised workers aged 16–59, not in EPFO/ESIC, not paying income tax", hi: "16–59 साल के असंगठित मज़दूर, जो EPFO/ESIC में नहीं और इनकम टैक्स नहीं भरते", mr: "16–59 वयाचे असंघटित कामगार, जे EPFO/ESIC मध्ये नाहीत आणि आयकर भरत नाहीत" },
    get: { en: "A national worker ID card. The government uses it to reach you with benefits and help in emergencies.", hi: "राष्ट्रीय मज़दूर पहचान पत्र। सरकार इसी से आप तक लाभ और आपदा में मदद पहुँचाती है।", mr: "राष्ट्रीय कामगार ओळखपत्र. सरकार याद्वारे तुमच्यापर्यंत लाभ आणि संकटात मदत पोहोचवते." },
    where: { en: "eshram.gov.in, any CSC centre, or call 14434", hi: "eshram.gov.in, कोई भी CSC केंद्र, या 14434 पर कॉल करें", mr: "eshram.gov.in, कोणतेही CSC केंद्र, किंवा 14434 वर कॉल करा" },
    docs: ["aadhaar", "mobile", "bank"],
    helpline: "14434",
    fits: (a) =>
      a.age !== "60+"
        ? { en: "You do daily-wage work and are under 60", hi: "आप दिहाड़ी काम करते हैं और 60 से कम उम्र के हैं", mr: "तुम्ही रोजंदारीचे काम करता आणि वय 60 पेक्षा कमी आहे" }
        : null,
  },
  {
    id: "bocw",
    kind: "welfare",
    name: { en: "Construction Workers Welfare Board", hi: "निर्माण मज़दूर कल्याण बोर्ड", mr: "बांधकाम कामगार कल्याण मंडळ" },
    short: { en: "Education, tools, health and housing help", hi: "पढ़ाई, औज़ार, इलाज और घर के लिए मदद", mr: "शिक्षण, अवजारे, आरोग्य आणि घरासाठी मदत" },
    benefit: { en: "Many benefits after registration", hi: "रजिस्ट्रेशन के बाद कई लाभ", mr: "नोंदणीनंतर अनेक लाभ" },
    who: { en: "Construction workers aged 18–60 who worked 90 days in the last 12 months", hi: "18–60 साल के निर्माण मज़दूर जिन्होंने पिछले 12 महीनों में 90 दिन काम किया", mr: "18–60 वयाचे बांधकाम कामगार ज्यांनी मागील 12 महिन्यांत 90 दिवस काम केले" },
    get: { en: "Scholarships for children, a grant for tools, accident and medical help, maternity help and housing support (Maharashtra: MahaBOCW).", hi: "बच्चों की पढ़ाई की स्कॉलरशिप, औज़ारों के लिए पैसा, दुर्घटना और इलाज की मदद, प्रसूति और घर के लिए सहायता (महाराष्ट्र: MahaBOCW)।", mr: "मुलांच्या शिक्षणासाठी शिष्यवृत्ती, अवजारांसाठी अनुदान, अपघात आणि उपचार मदत, प्रसूती आणि घरासाठी मदत (महाराष्ट्र: MahaBOCW)." },
    where: { en: "MahaBOCW facilitation centre in your ward, or mahabocw.in", hi: "आपके वार्ड का MahaBOCW सुविधा केंद्र, या mahabocw.in", mr: "तुमच्या वॉर्डमधील MahaBOCW सुविधा केंद्र, किंवा mahabocw.in" },
    docs: ["aadhaar", "bank", "photo", "work90", "age"],
    fits: (a) =>
      a.work === "construction" && a.age !== "60+"
        ? { en: "You do construction work — painting, masonry, tiling, plumbing and wiring count", hi: "आप निर्माण का काम करते हैं — पेंटिंग, चिनाई, टाइल, प्लंबिंग, वायरिंग सब गिना जाता है", mr: "तुम्ही बांधकामाचे काम करता — रंगकाम, गवंडीकाम, टाइल, प्लंबिंग, वायरिंग सगळे धरले जाते" }
        : null,
  },
  {
    id: "pmsym",
    kind: "pension",
    name: { en: "PM Shram Yogi Maan-dhan", hi: "पीएम श्रम योगी मान-धन", mr: "पीएम श्रम योगी मान-धन" },
    short: { en: "₹3,000 pension every month after 60", hi: "60 के बाद हर महीने ₹3,000 पेंशन", mr: "60 नंतर दरमहा ₹3,000 पेन्शन" },
    benefit: { en: "₹3,000 / month pension", hi: "₹3,000 / महीना पेंशन", mr: "₹3,000 / महिना पेन्शन" },
    who: { en: "Unorganised workers aged 18–40 earning up to ₹15,000 a month", hi: "18–40 साल के असंगठित मज़दूर जिनकी कमाई ₹15,000 महीना तक है", mr: "18–40 वयाचे असंघटित कामगार ज्यांचे उत्पन्न दरमहा ₹15,000 पर्यंत आहे" },
    get: { en: "You put in ₹55–₹200 a month depending on your age, and the government adds the same amount.", hi: "उम्र के हिसाब से आप ₹55–₹200 महीना जमा करते हैं, और सरकार उतना ही जोड़ती है।", mr: "वयानुसार तुम्ही दरमहा ₹55–₹200 भरता, आणि सरकार तितकीच रक्कम जोडते." },
    where: { en: "Any CSC centre — bring your bank passbook", hi: "कोई भी CSC केंद्र — बैंक पासबुक साथ लाएँ", mr: "कोणतेही CSC केंद्र — बँक पासबुक सोबत आणा" },
    docs: ["aadhaar", "bank", "mobile"],
    helpline: "14434",
    fits: (a) =>
      a.age === "18-40" && a.income === "under-15k"
        ? { en: "You are 18–40 and earn under ₹15,000 a month", hi: "आपकी उम्र 18–40 है और कमाई ₹15,000 महीना से कम है", mr: "तुमचे वय 18–40 आहे आणि उत्पन्न दरमहा ₹15,000 पेक्षा कमी आहे" }
        : null,
  },
  {
    id: "pmjay",
    kind: "health",
    name: { en: "Ayushman Bharat (PM-JAY)", hi: "आयुष्मान भारत (PM-JAY)", mr: "आयुष्मान भारत (PM-JAY)" },
    short: { en: "Free hospital care up to ₹5 lakh a year", hi: "साल में ₹5 लाख तक मुफ़्त इलाज", mr: "वर्षाला ₹5 लाखांपर्यंत मोफत उपचार" },
    benefit: { en: "₹5 lakh / family / year", hi: "₹5 लाख / परिवार / साल", mr: "₹5 लाख / कुटुंब / वर्ष" },
    who: { en: "Families on the PM-JAY list — check with your ration card or Aadhaar", hi: "PM-JAY सूची वाले परिवार — राशन कार्ड या आधार से जाँचें", mr: "PM-JAY यादीतील कुटुंबे — रेशन कार्ड किंवा आधारने तपासा" },
    get: { en: "Cashless treatment at listed government and private hospitals for your whole family.", hi: "सूचीबद्ध सरकारी और प्राइवेट अस्पतालों में पूरे परिवार का बिना पैसे इलाज।", mr: "यादीतील सरकारी आणि खाजगी रुग्णालयांत संपूर्ण कुटुंबाला कॅशलेस उपचार." },
    where: { en: "Ayushman desk at a listed hospital, a CSC centre, or call 14555", hi: "अस्पताल का आयुष्मान डेस्क, CSC केंद्र, या 14555 पर कॉल करें", mr: "रुग्णालयातील आयुष्मान डेस्क, CSC केंद्र, किंवा 14555 वर कॉल करा" },
    docs: ["aadhaar", "ration"],
    helpline: "14555",
    fits: () => ({ en: "Most daily-wage families qualify — check in 2 minutes", hi: "ज़्यादातर दिहाड़ी परिवार पात्र हैं — 2 मिनट में जाँचें", mr: "बहुतेक रोजंदारी कुटुंबे पात्र आहेत — 2 मिनिटांत तपासा" }),
  },
  {
    id: "pmsby",
    kind: "insurance",
    name: { en: "PM Suraksha Bima", hi: "पीएम सुरक्षा बीमा", mr: "पीएम सुरक्षा विमा" },
    short: { en: "₹2 lakh accident cover for ₹20 a year", hi: "₹20 साल में ₹2 लाख का दुर्घटना बीमा", mr: "₹20 वर्षाला ₹2 लाखांचा अपघात विमा" },
    benefit: { en: "₹20 / year", hi: "₹20 / साल", mr: "₹20 / वर्ष" },
    who: { en: "Anyone aged 18–70 with a bank account", hi: "18–70 साल का कोई भी व्यक्ति जिसका बैंक खाता है", mr: "बँक खाते असलेले 18–70 वयाचे कोणीही" },
    get: { en: "₹2 lakh for accidental death or full disability, ₹1 lakh for partial disability. Cut automatically from your account once a year.", hi: "दुर्घटना में मृत्यु या पूरी विकलांगता पर ₹2 लाख, आंशिक पर ₹1 लाख। साल में एक बार खाते से अपने-आप कटता है।", mr: "अपघाती मृत्यू किंवा पूर्ण अपंगत्वासाठी ₹2 लाख, अंशतः ₹1 लाख. वर्षातून एकदा खात्यातून आपोआप कापले जाते." },
    where: { en: "Your bank branch or bank app", hi: "अपनी बैंक शाखा या बैंक ऐप", mr: "तुमची बँक शाखा किंवा बँक ॲप" },
    docs: ["bank", "aadhaar"],
    fits: (a) =>
      a.bank === "yes"
        ? { en: "Your work has accident risk and you have a bank account", hi: "आपके काम में दुर्घटना का ख़तरा है और आपका बैंक खाता है", mr: "तुमच्या कामात अपघाताचा धोका आहे आणि तुमचे बँक खाते आहे" }
        : null,
  },
  {
    id: "pmjjby",
    kind: "insurance",
    name: { en: "PM Jeevan Jyoti Bima", hi: "पीएम जीवन ज्योति बीमा", mr: "पीएम जीवन ज्योती विमा" },
    short: { en: "₹2 lakh life cover for ₹436 a year", hi: "₹436 साल में ₹2 लाख का जीवन बीमा", mr: "₹436 वर्षाला ₹2 लाखांचा जीवन विमा" },
    benefit: { en: "₹436 / year", hi: "₹436 / साल", mr: "₹436 / वर्ष" },
    who: { en: "Anyone aged 18–50 with a bank account", hi: "18–50 साल का कोई भी व्यक्ति जिसका बैंक खाता है", mr: "बँक खाते असलेले 18–50 वयाचे कोणीही" },
    get: { en: "Your family gets ₹2 lakh if something happens to you, for any reason.", hi: "आपको कुछ हो जाए तो परिवार को ₹2 लाख मिलते हैं, किसी भी कारण से।", mr: "तुम्हाला काही झाले तर कुटुंबाला ₹2 लाख मिळतात, कोणत्याही कारणाने." },
    where: { en: "Your bank branch or bank app", hi: "अपनी बैंक शाखा या बैंक ऐप", mr: "तुमची बँक शाखा किंवा बँक ॲप" },
    docs: ["bank", "aadhaar"],
    fits: (a) =>
      a.bank === "yes" && a.age === "18-40"
        ? { en: "You are under 50 and have a bank account", hi: "आपकी उम्र 50 से कम है और बैंक खाता है", mr: "तुमचे वय 50 पेक्षा कमी आहे आणि बँक खाते आहे" }
        : null,
  },
  {
    id: "svanidhi",
    kind: "loan",
    name: { en: "PM SVANidhi", hi: "पीएम स्वनिधि", mr: "पीएम स्वनिधी" },
    short: { en: "Small loans for street vendors and hawkers", hi: "रेहड़ी-पटरी वालों के लिए छोटा लोन", mr: "फेरीवाल्यांसाठी छोटे कर्ज" },
    benefit: { en: "Loan without guarantee", hi: "बिना गारंटी लोन", mr: "हमीशिवाय कर्ज" },
    who: { en: "Street vendors and hawkers in cities", hi: "शहरों के रेहड़ी-पटरी और फेरीवाले", mr: "शहरांतील फेरीवाले आणि पथविक्रेते" },
    get: { en: "Working-capital loans in steps, with an interest subsidy and cashback when you repay on time and pay digitally.", hi: "किस्तों में कारोबार के लिए लोन, समय पर चुकाने और डिजिटल पेमेंट पर ब्याज में छूट और कैशबैक।", mr: "टप्प्याटप्प्याने व्यवसायासाठी कर्ज, वेळेवर फेड आणि डिजिटल पेमेंटवर व्याज सवलत व कॅशबॅक." },
    where: { en: "pmsvanidhi.mohua.gov.in, your ward office or a CSC centre", hi: "pmsvanidhi.mohua.gov.in, वार्ड ऑफ़िस या CSC केंद्र", mr: "pmsvanidhi.mohua.gov.in, वॉर्ड ऑफिस किंवा CSC केंद्र" },
    docs: ["aadhaar", "bank", "mobile"],
    fits: (a) =>
      a.work === "vending"
        ? { en: "You sell on the street", hi: "आप सड़क पर सामान बेचते हैं", mr: "तुम्ही रस्त्यावर विक्री करता" }
        : null,
  },
  {
    id: "onorc",
    kind: "ration",
    name: { en: "One Nation One Ration Card", hi: "एक देश एक राशन कार्ड", mr: "एक देश एक रेशन कार्ड" },
    short: { en: "Get your ration in any city", hi: "किसी भी शहर में राशन लें", mr: "कोणत्याही शहरात रेशन घ्या" },
    benefit: { en: "Ration anywhere in India", hi: "भारत में कहीं भी राशन", mr: "भारतात कुठेही रेशन" },
    who: { en: "Families with a ration card under the food security law", hi: "खाद्य सुरक्षा कानून के तहत राशन कार्ड वाले परिवार", mr: "अन्न सुरक्षा कायद्याअंतर्गत रेशन कार्ड असलेली कुटुंबे" },
    get: { en: "Your family back home keeps their ration, and you can collect yours from any ration shop here with your fingerprint.", hi: "गाँव में परिवार का राशन चलता रहे, और आप यहाँ किसी भी राशन दुकान से अँगूठा लगाकर अपना राशन लें।", mr: "गावाकडे कुटुंबाचे रेशन चालू राहते, आणि तुम्ही इथे कोणत्याही रेशन दुकानातून अंगठा लावून रेशन घेऊ शकता." },
    where: { en: "Any fair price (ration) shop — use the Mera Ration app to find one", hi: "कोई भी राशन दुकान — 'मेरा राशन' ऐप से खोजें", mr: "कोणतेही रेशन दुकान — 'मेरा रेशन' ॲपने शोधा" },
    docs: ["ration", "aadhaar"],
    fits: () => ({ en: "Useful if your family lives in another town or state", hi: "काम का है अगर परिवार दूसरे शहर या राज्य में है", mr: "कुटुंब दुसऱ्या गावात किंवा राज्यात असल्यास उपयोगी" }),
  },
];

export interface HelpCentre {
  id: string;
  name: L10n;
  does: L10n;
  km: number;
  hours: L10n;
  pin: { x: number; y: number };
}

/** Sample help points shown on the map (demo data). */
export const HELP_CENTRES: HelpCentre[] = [
  {
    id: "csc-ghatkopar",
    name: { en: "CSC centre, Ghatkopar West", hi: "CSC केंद्र, घाटकोपर पश्चिम", mr: "CSC केंद्र, घाटकोपर पश्चिम" },
    does: { en: "e-Shram, pension, Ayushman card", hi: "ई-श्रम, पेंशन, आयुष्मान कार्ड", mr: "ई-श्रम, पेन्शन, आयुष्मान कार्ड" },
    km: 0.8,
    hours: { en: "Mon–Sat · 10 AM – 6 PM", hi: "सोम–शनि · सुबह 10 – शाम 6", mr: "सोम–शनि · सकाळी 10 – संध्या. 6" },
    pin: { x: 44, y: 54 },
  },
  {
    id: "bocw-kurla",
    name: { en: "Welfare Board facilitation centre, Kurla", hi: "कल्याण बोर्ड सुविधा केंद्र, कुर्ला", mr: "कल्याण मंडळ सुविधा केंद्र, कुर्ला" },
    does: { en: "Construction worker registration", hi: "निर्माण मज़दूर रजिस्ट्रेशन", mr: "बांधकाम कामगार नोंदणी" },
    km: 4.2,
    hours: { en: "Mon–Fri · 10 AM – 5 PM", hi: "सोम–शुक्र · सुबह 10 – शाम 5", mr: "सोम–शुक्र · सकाळी 10 – संध्या. 5" },
    pin: { x: 25, y: 68 },
  },
  {
    id: "legal-aid",
    name: { en: "Free legal aid clinic, Vikhroli", hi: "मुफ़्त कानूनी सहायता केंद्र, विक्रोली", mr: "मोफत कायदेशीर मदत केंद्र, विक्रोळी" },
    does: { en: "Unpaid wages, cheating, police help", hi: "मज़दूरी न मिलना, धोखा, पुलिस मदद", mr: "मजुरी न मिळणे, फसवणूक, पोलीस मदत" },
    km: 3.6,
    hours: { en: "Every Saturday · 11 AM – 3 PM", hi: "हर शनिवार · सुबह 11 – दोपहर 3", mr: "दर शनिवारी · सकाळी 11 – दुपारी 3" },
    pin: { x: 62, y: 40 },
  },
];

export interface Helpline {
  number: string;
  name: L10n;
  for: L10n;
}

export const HELPLINES: Helpline[] = [
  {
    number: "14434",
    name: { en: "e-Shram helpline", hi: "ई-श्रम हेल्पलाइन", mr: "ई-श्रम हेल्पलाइन" },
    for: { en: "Worker card, pension", hi: "मज़दूर कार्ड, पेंशन", mr: "कामगार कार्ड, पेन्शन" },
  },
  {
    number: "15100",
    name: { en: "Free legal aid (NALSA)", hi: "मुफ़्त कानूनी सहायता (NALSA)", mr: "मोफत कायदेशीर मदत (NALSA)" },
    for: { en: "Unpaid wages, cheating", hi: "मज़दूरी न मिलना, धोखा", mr: "मजुरी न मिळणे, फसवणूक" },
  },
  {
    number: "14555",
    name: { en: "Ayushman Bharat", hi: "आयुष्मान भारत", mr: "आयुष्मान भारत" },
    for: { en: "Free hospital care", hi: "मुफ़्त इलाज", mr: "मोफत उपचार" },
  },
  {
    number: "181",
    name: { en: "Women helpline", hi: "महिला हेल्पलाइन", mr: "महिला हेल्पलाइन" },
    for: { en: "Harassment at work", hi: "काम पर उत्पीड़न", mr: "कामावर छळ" },
  },
  {
    number: "112",
    name: { en: "Emergency", hi: "आपातकाल", mr: "आणीबाणी" },
    for: { en: "Police, fire, ambulance", hi: "पुलिस, फ़ायर, एम्बुलेंस", mr: "पोलीस, अग्निशमन, रुग्णवाहिका" },
  },
];
