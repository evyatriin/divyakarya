const { Dosha, EPuja } = require('./models');

async function seedDoshasAndEPujas() {
    try {
        // Seed Doshas - 10 comprehensive doshas
        const doshas = [
            {
                name: 'Mangal / Kuja / Manglik Dosha Nivaran Puja',
                slug: 'manglik-dosha',
                icon: '🔴',
                description: 'Remedy for Mangal dosha causing marriage delays, conflicts, and relationship challenges',
                duration: '2-3 hours homam at temple',
                mode: 'Temple e-puja / Virtual homam / Home visit optional',
                recommendedWhen: [
                    'Delays in marriage despite efforts',
                    'Frequent conflicts with spouse or partner',
                    'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house',
                    'Kundli matching shows Manglik dosha'
                ],
                whoPerforms: 'Senior Vedic pandits trained in Shukla Yajurveda tradition with 10+ years experience',
                locationOptions: ['Ujjain Mangalnath Temple', 'Varanasi', 'Gaya', 'Home via video'],
                inclusions: [
                    'Sankalp in your name & gotra',
                    'Full Mangal Shanti Homam',
                    'Mangal Kavacham recitation',
                    'Digital HD video recording',
                    'E-certificate of completion',
                    'Prasad (optional courier)'
                ],
                price: 2100,
                pricingTiers: {
                    basic: { price: 2100, label: 'Basic', features: ['Single priest', 'Standard homam', 'Digital video', 'E-certificate'] },
                    standard: { price: 3500, label: 'Standard', features: ['2 priests', 'Extended japa (11000)', 'HD video', 'Prasad courier'] },
                    premium: { price: 5100, label: 'Premium', features: ['3 priests', 'Full elaborate homam', '4K video', 'Kumbh Vivah ritual', 'Family sankalp'] }
                },
                availableDates: 'Tuesdays, Mangal Nakshatra days, Pratipada tithi',
                whatIsDosha: 'Manglik Dosha occurs when Mars (Mangal) is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house of the horoscope. Mars is a fiery, aggressive planet, and its malefic placement can cause delays in marriage, discord in relationships, and temperamental issues. This dosha is particularly examined during Kundli matching for marriage.',
                whyPuja: 'Mangal Shanti Puja pacifies the negative effects of Mars through Vedic mantras, homam, and specific rituals. The puja invokes Lord Mangal and seeks his blessings for harmonious relationships. Performing this at sacred sites like Ujjain Mangalnath Temple is considered especially auspicious.',
                whatWillBeDone: 'Ganapati Puja → Sankalp with your name, gotra, and birth details → Navgraha Sthapana → Mangal Yantra Puja → Main Mangal graha homam with ghee, red flowers, and sesame → 11,000 Mangal mantra japa → Aarti → Prasad distribution → Brahmin bhojan (food donation)',
                whatYouReceive: ['Full HD/4K video of complete puja', 'E-certificate with sankalp details', 'Energized Mangal Yantra (Premium)', 'Prasad: Red thread, kumkum, flowers (courier optional)', 'Japa completion certificate'],
                importantDays: 'Tuesdays are most auspicious. Especially powerful during Mangal Hora, on Chitra or Mrigashira Nakshatra days, and during Mars transit periods.',
                samagri: 'All samagri (puja materials) arranged by temple/pandit including red flowers, red cloth, wheat, jaggery, copper vessel, ghee, sesame seeds, and Mangal Yantra. No preparation needed from devotee for e-puja.',
                preparation: 'Observe fast on the day of puja (fruit diet acceptable). Wear red or orange colored clothes. Maintain calm and positive mindset. Join the video call 10 minutes before scheduled time.',
                faqs: [
                    { question: 'Can family members watch the puja?', answer: 'Yes, unlimited family members can join the live stream. Share the link with them.' },
                    { question: 'What if my internet drops during puja?', answer: 'The puja continues regardless. You will receive the complete recording within 24 hours.' },
                    { question: 'How do I reschedule?', answer: 'Contact us at least 24 hours before. One free reschedule is allowed.' },
                    { question: 'Is this effective for both male and female Manglik?', answer: 'Yes, the puja is equally effective for both genders.' }
                ],
                details: 'Complete Mangal/Kuja Dosha Nivaran Puja with homam and japa for marriage delays and relationship harmony.',
                remedies: ['Mangal Shanti Homam', 'Hanuman Chalisa daily', 'Donate red items on Tuesdays', 'Wear coral gemstone (with guidance)'],
                displayOrder: 1
            },
            {
                name: 'Kaal Sarp Dosha Nivaran Puja',
                slug: 'kaal-sarp-dosha',
                icon: '🐍',
                description: 'Remedy for Kaal Sarp dosha causing repeated setbacks, fear, and chronic life obstacles',
                duration: '3-4 hours elaborate homam',
                mode: 'Temple e-puja at Trimbakeshwar / Virtual homam',
                recommendedWhen: [
                    'Repeated failures despite hard work',
                    'Chronic health issues without clear cause',
                    'Disturbing dreams involving snakes',
                    'All planets between Rahu and Ketu in horoscope'
                ],
                whoPerforms: 'Authorized Trimbakeshwar priests or senior pandits with Kaal Sarp puja specialization',
                locationOptions: ['Trimbakeshwar Temple (most powerful)', 'Kalahasti Temple', 'Mahakaleshwar Ujjain', 'Virtual from Varanasi'],
                inclusions: [
                    'Sankalp with complete birth details',
                    'Naag Bali ritual',
                    'Sarpa Suktam recitation',
                    'Tripindi Shradh (if applicable)',
                    'Full HD video recording',
                    'Temple prasad courier'
                ],
                price: 3500,
                pricingTiers: {
                    basic: { price: 3500, label: 'Basic', features: ['Single priest', 'Standard Kaal Sarp puja', 'Video recording'] },
                    standard: { price: 5500, label: 'Standard', features: ['2 priests', 'Naag Bali included', 'HD video', 'Prasad courier'] },
                    premium: { price: 11000, label: 'Premium (Trimbakeshwar)', features: ['Official Trimbakeshwar priests', 'Complete Naag Bali + Narayan Bali', 'Tripindi Shradh', '4K video', 'Multiple family sankalp'] }
                },
                availableDates: 'Nag Panchami, Amavasya, Panchami tithi, Ashlesha Nakshatra days',
                whatIsDosha: 'Kaal Sarp Dosha occurs when all seven planets in a horoscope are hemmed between Rahu (Dragon\'s Head) and Ketu (Dragon\'s Tail). This creates a serpent-like grip on one\'s destiny, causing struggles, fears, delays, and obstacles. There are 12 types based on Rahu-Ketu axis position, each affecting different life areas.',
                whyPuja: 'The Kaal Sarp Nivaran Puja neutralizes the negative serpent energy through powerful Vedic rituals. Trimbakeshwar Temple is considered the most effective location as it is one of the 12 Jyotirlingas with special Naag (serpent) significance. The puja pacifies both Rahu and Ketu simultaneously.',
                whatWillBeDone: 'Ganapati Puja → Sankalp → Naag Prathishtha (serpent deity installation) → Sarpa Suktam and Rahu-Ketu mantra japa → Naag Bali ritual with silver serpent → Main Kaal Sarp Shanti Homam → Rahu-Ketu graha shanti → Aarti → Brahmin bhojan',
                whatYouReceive: ['Complete puja video (HD/4K)', 'Sankalp certificate', 'Energized Kaal Sarp Yantra', 'Prasad: Sacred thread, vibhuti, silver serpent replica', 'Rahu-Ketu mantra sheet'],
                importantDays: 'Most powerful on Nag Panchami. Also effective on Amavasya (new moon), Saturdays, and during Rahu Kaal. Ashlesha Nakshatra days are particularly auspicious.',
                samagri: 'Includes silver Naag (serpent), black sesame, mustard oil, blue flowers, durva grass, and specific herbs. All arranged by temple. For Trimbakeshwar, official temple materials are used.',
                preparation: 'Fast on puja day (milk and fruits allowed). Avoid non-vegetarian food for 3 days before. Wear dark blue or black clothes. Keep a calm mind and avoid arguments.',
                faqs: [
                    { question: 'How do I know if I have Kaal Sarp Dosha?', answer: 'Check your birth chart - if all 7 planets are between Rahu and Ketu, you have this dosha. We offer free verification.' },
                    { question: 'Is Trimbakeshwar puja necessary or will virtual work?', answer: 'Trimbakeshwar is most powerful for severe cases. Virtual puja is effective for mild to moderate dosha.' },
                    { question: 'How many times should this puja be done?', answer: 'Usually once is sufficient. For severe dosha, annual puja on Nag Panchami is recommended.' }
                ],
                details: 'Powerful Kaal Sarp Dosha Nivaran at sacred sites to remove serpent affliction causing life obstacles.',
                remedies: ['Kaal Sarp Puja at Trimbakeshwar', 'Rahu-Ketu Shanti Homam', 'Feed snakes milk on Nag Panchami', 'Donate to snake protection causes'],
                displayOrder: 2
            },
            {
                name: 'Pitra / Pitru Dosha Nivaran Puja',
                slug: 'pitra-dosha',
                icon: '🙏',
                description: 'Remedy for ancestral karma issues causing repeated family problems and blocked progress',
                duration: '1.5-2 hours tarpan and shradh',
                mode: 'Temple e-puja at sacred ghats / Virtual tarpan',
                recommendedWhen: [
                    'Recurring family disputes across generations',
                    'Unexplained childlessness or child health issues',
                    'Financial blocks despite good income',
                    'Sun with Rahu/Ketu in 9th house, or afflicted 9th lord'
                ],
                whoPerforms: 'Specialized Gaya Pandas or senior pandits trained in Shradh and Tarpan rituals',
                locationOptions: ['Gaya (most sacred for Pitra)', 'Varanasi Ghats', 'Haridwar Har Ki Pauri', 'Allahabad Sangam'],
                inclusions: [
                    'Sankalp for 3 generations of ancestors',
                    'Pitra Tarpan with til and water',
                    'Pinda Daan (rice ball offering)',
                    'Brahmin bhojan in ancestors\' name',
                    'Video of complete ceremony',
                    'Prasad and sacred thread'
                ],
                price: 1500,
                pricingTiers: {
                    basic: { price: 1500, label: 'Basic', features: ['Tarpan only', 'Single generation', 'Video recording'] },
                    standard: { price: 2500, label: 'Standard', features: ['Tarpan + Pinda Daan', '3 generations', 'Brahmin bhojan', 'HD video'] },
                    premium: { price: 5100, label: 'Premium (Gaya)', features: ['Complete Gaya Shradh', '7 generations', 'Multiple pind locations', 'Vishnupad Temple ritual', 'Prasad courier'] }
                },
                availableDates: 'Pitru Paksha (September-October), Amavasya, death anniversaries (tithi)',
                whatIsDosha: 'Pitra Dosha arises when ancestors are not at peace due to incomplete death rites, unfulfilled wishes, or karmic debts. In the horoscope, Sun with Rahu or afflicted 9th house indicates this dosha. It manifests as recurring family issues, financial blocks, and obstacles in having or raising children.',
                whyPuja: 'Pitra Shradh and Tarpan rituals provide spiritual nourishment to ancestral souls, helping them attain peace. When ancestors are satisfied, they bless the family with prosperity. Gaya is considered the most sacred place for these rituals as mentioned in Garuda Purana.',
                whatWillBeDone: 'Ganapati Puja → Sankalp with gotram and ancestor names → Pitra invocation → Tarpan with black sesame and water → Pinda Daan (rice + barley + black sesame balls) → Vastra Daan (cloth offering) → Brahmin bhojan → Ancestors\' blessings sought',
                whatYouReceive: ['Complete ritual video', 'Sankalp certificate with ancestor names', 'Blessed sacred thread', 'Prasad from Gaya/Varanasi', 'Guidance for annual observance'],
                importantDays: 'Pitru Paksha (Mahalaya Paksha) is most powerful. Also death anniversary (tithi), Amavasya, and Mauni Amavasya. Gaya Shradh can be done any day.',
                samagri: 'Black sesame seeds, rice, barley, durva grass, white flowers, clothes for donation, food for Brahmin bhojan. All arranged at sacred location.',
                preparation: 'Names of paternal ancestors for 3 generations required. Observe fast (one meal). Wear white clothes. Maintain peaceful mind, avoid anger and arguments.',
                faqs: [
                    { question: 'What if I don\'t know my ancestors\' names?', answer: 'Sankalp can be done with gotra name and general reference. The ritual remains effective.' },
                    { question: 'Should I do this every year?', answer: 'Yes, doing Tarpan during Pitru Paksha annually is recommended. Full Shradh can be done once.' },
                    { question: 'Can this be done for maternal ancestors too?', answer: 'Yes, a separate sankalp can include maternal lineage. Premium package covers both.' }
                ],
                details: 'Sacred Pitra Dosha Nivaran through Tarpan and Shradh for ancestral peace and family prosperity.',
                remedies: ['Pinda Daan at Gaya', 'Tarpan during Pitru Paksha', 'Feed crows and Brahmins', 'Donate to elderly care'],
                displayOrder: 3
            },
            {
                name: 'Shani Dosha / Sade Sati Shanti Puja',
                slug: 'shani-dosha',
                icon: '⚫',
                description: 'Remedy for Saturn transit (Sade Sati) causing job loss, health struggles, and delays',
                duration: '2-3 hours Shani Shanti Homam',
                mode: 'Temple e-puja / Virtual homam / Home visit',
                recommendedWhen: [
                    'Currently undergoing Sade Sati (7.5 years Saturn transit)',
                    'Shani Dhaiya (2.5 years Saturn period)',
                    'Sudden job loss or career stagnation',
                    'Chronic health issues, especially bone/joint related'
                ],
                whoPerforms: 'Vedic pandits specializing in Navagraha and Shani Shanti with 15+ years experience',
                locationOptions: ['Shani Shingnapur', 'Thirunallar (Tamil Nadu)', 'Shani Dev Mandir Delhi', 'Virtual from any Shani temple'],
                inclusions: [
                    'Sankalp with Shani position details',
                    'Shani Yantra Puja',
                    'Shani Maha Mantra Japa (23,000)',
                    'Til Tel Abhishek (sesame oil bath)',
                    'Blue flower and black cloth offering',
                    'HD video and e-certificate'
                ],
                price: 2500,
                pricingTiers: {
                    basic: { price: 2500, label: 'Basic', features: ['Shani Shanti Puja', '11,000 mantra japa', 'Video recording'] },
                    standard: { price: 4000, label: 'Standard', features: ['Full Shani Homam', '23,000 japa', 'Til Tel Abhishek', 'HD video', 'Prasad courier'] },
                    premium: { price: 7500, label: 'Premium', features: ['Elaborate Shani Maha Shanti', '51,000 japa', 'Navgraha Homam included', 'Shani Yantra consecration', 'Quarterly follow-up pujas'] }
                },
                availableDates: 'Saturdays (especially Shani Amavasya), Shani Pradosh, Shani Jayanti',
                whatIsDosha: 'Shani (Saturn) dosha manifests during Sade Sati (7.5 years when Saturn transits over natal Moon), Shani Dhaiya, or when Saturn is malefically placed in the birth chart. Saturn governs karma, discipline, and hardship, bringing tests of patience and perseverance.',
                whyPuja: 'Shani Shanti Puja does not remove the karmic lessons of Saturn but eases the severity. Pleased Shani Dev reduces obstacles and grants wisdom, discipline, and eventual success. The puja invokes Shani with respect and surrender, acknowledging his role as a strict teacher.',
                whatWillBeDone: 'Ganapati Puja → Navgraha Sthapana → Shani Dev invocation → Shani Yantra Puja → Til Tel (sesame oil) Abhishek → Shani Maha Mantra Japa → Shani Homam with black sesame and mustard oil → Aarti → Donation of black items',
                whatYouReceive: ['Complete puja video', 'Energized Shani Yantra', 'E-certificate with Sade Sati details', 'Prasad: Black sesame, iron ring, blue cloth', 'Weekly Shani mantra guide'],
                importantDays: 'Saturdays are the only day for Shani puja. Most powerful on Shani Amavasya, Shani Jayanti, and during Shani Pradosh Vrat.',
                samagri: 'Black sesame (til), mustard oil, blue/black flowers, iron items, black cloth, urad dal, and Shani Yantra. All arranged by pandit.',
                preparation: 'Strict fast on puja day (urad dal and sesame khichdi for one meal is traditional). Wear blue or black clothes. Avoid leather items. Maintain humble attitude.',
                faqs: [
                    { question: 'How do I know if I have Sade Sati?', answer: 'When Saturn transits the 12th, 1st, and 2nd houses from your Moon sign (7.5 years total). Check your Moon sign and current Saturn position.' },
                    { question: 'Can Sade Sati effects be completely removed?', answer: 'The puja reduces severity but Saturn\'s lessons continue. It brings support and patience during the period.' },
                    { question: 'Should I donate to beggars on Saturdays?', answer: 'Yes, donating to the needy (especially disabled persons) on Saturdays pleases Saturn. Include black items, oil, or dal.' }
                ],
                details: 'Powerful Shani Shanti for Sade Sati, Shani Dhaiya, and Saturn afflictions in horoscope.',
                remedies: ['Shani Shanti Homam', 'Light til oil lamp on Saturdays', 'Donate black items', 'Recite Shani Chalisa', 'Serve the elderly'],
                displayOrder: 4
            },
            {
                name: 'Nadi Dosha Shanti Puja',
                slug: 'nadi-dosha',
                icon: '💫',
                description: 'Remedy for Nadi dosha in Kundli matching causing marriage compatibility concerns',
                duration: '2-3 hours specialized shanti puja',
                mode: 'Temple e-puja / Virtual homam / Home visit optional',
                recommendedWhen: [
                    'Nadi dosha found in Kundli matching (Eka Nadi)',
                    'Concerns about childbearing after marriage',
                    'Repeated health issues after marriage',
                    'Zero points in Nadi Koota during matching'
                ],
                whoPerforms: 'Senior astrologer-pandits with expertise in Kundli matching and graha shanti',
                locationOptions: ['Ujjain', 'Varanasi', 'Rameshwaram', 'Virtual from temple'],
                inclusions: [
                    'Detailed Kundli analysis',
                    'Couple sankalp with both gotras',
                    'Nadi Dosha Shanti Homam',
                    'Maha Mrityunjaya Japa',
                    'Graha Shanti',
                    'Video and certificate'
                ],
                price: 2100,
                pricingTiers: {
                    basic: { price: 2100, label: 'Basic', features: ['Nadi Shanti Puja', 'Basic homam', 'Video recording'] },
                    standard: { price: 3500, label: 'Standard', features: ['Detailed Kundli analysis', 'Full Nadi Shanti Homam', 'Maha Mrityunjaya Japa', 'HD video'] },
                    premium: { price: 5500, label: 'Premium', features: ['Comprehensive compatibility remedies', 'Multiple graha shanti', 'Both families sankalp', 'Blessed items for wedding', 'Follow-up consultation'] }
                },
                availableDates: 'Auspicious muhurat days, Ekadashi, Full Moon days',
                whatIsDosha: 'Nadi Dosha occurs when both prospective bride and groom have the same Nadi (Aadi, Madhya, or Antya) in their horoscopes. In Ashta Koota matching, Nadi gets 8 points—the highest. Same Nadi scores zero, indicating potential health issues for offspring and lack of physical compatibility.',
                whyPuja: 'Nadi Shanti Puja invokes divine blessings to neutralize the negative effects of Eka Nadi (same Nadi) between couples. The Maha Mrityunjaya Mantra protects health, while specific graha shanti harmonizes the couple\'s planetary energies.',
                whatWillBeDone: 'Both Kundlis analysis → Ganapati Puja → Couple Sankalp → Nadi Devta Puja → Maha Mrityunjaya Japa (11,000) → Graha Shanti for both charts → Special Homam → Swayamvara Parvathi Mantra → Blessings and prasad',
                whatYouReceive: ['Complete puja video', 'Compatibility report with remedies', 'Blessed mangal sutra/sacred thread', 'Couple certificate for wedding', 'Post-wedding ritual guide'],
                importantDays: 'Before wedding is essential. Perform on Ekadashi, Purnima, or any auspicious muhurat. Avoid Shukla Paksha Ashtami and Navami.',
                samagri: 'Materials for both individuals, mango leaves, rice, flowers, ghee, honey, and special herbs for Mrityunjaya Homam. Arranged by pandit.',
                preparation: 'Both bride and groom should fast. Wear yellow or green clothes. Exchange birth details and gotra information in advance. Maintain positive mindset about marriage.',
                faqs: [
                    { question: 'Is marriage not advised if Nadi dosha exists?', answer: 'Marriage can proceed after proper Nadi Shanti Puja. Many exceptions exist based on other chart factors that reduce dosha effect.' },
                    { question: 'Should both partners participate in the puja?', answer: 'Yes, ideally both should participate (can be via video). If not possible, one can represent both with proper sankalp.' },
                    { question: 'When should this puja be done?', answer: 'Definitely before marriage. Can also be done after marriage if issues are observed.' }
                ],
                details: 'Nadi Dosha Nivaran for couples with same Nadi in Kundli matching, protecting marital harmony.',
                remedies: ['Nadi Shanti Puja before marriage', 'Maha Mrityunjaya Japa', 'Donate gold equivalent to bride\'s weight in rice (symbolic)', 'Visit Rameshwaram together'],
                displayOrder: 5
            },
            {
                name: 'Graha Shanti / Navgraha Dosh Nivaran Puja',
                slug: 'navgraha-dosha',
                icon: '🪐',
                description: 'Comprehensive remedy for multiple planetary doshas affecting overall life progress',
                duration: '3-4 hours elaborate Navgraha Homam',
                mode: 'Temple e-puja / Virtual homam / Home visit available',
                recommendedWhen: [
                    'Multiple planets afflicted in horoscope',
                    'General bad luck and obstacles in all areas',
                    'Before major life events (marriage, business, travel)',
                    'During planetary dasha transitions'
                ],
                whoPerforms: 'Senior Vedic pandits with complete Navgraha puja training and 15+ years experience',
                locationOptions: ['Navagraha Temple Kumbakonam', 'Suryanar Kovil', 'Thirunageswaram', 'Any Navagraha temple virtually'],
                inclusions: [
                    'Complete Navgraha Sthapana',
                    'Individual puja for all 9 planets',
                    'Navgraha Homam',
                    '108 japa for each graha',
                    'Planet-specific prasad',
                    'Full video and detailed certificate'
                ],
                price: 3100,
                pricingTiers: {
                    basic: { price: 3100, label: 'Basic', features: ['Navgraha Puja', '108 japa per graha', 'Video recording'] },
                    standard: { price: 5100, label: 'Standard', features: ['Navgraha Puja + Homam', '1008 japa per graha', 'HD video', 'Navgraha Yantra'] },
                    premium: { price: 9100, label: 'Premium', features: ['Elaborate Maha Navgraha Homam', 'Visit all 9 Navagraha temples virtually', 'Individual graha yantras', 'Quarterly graha shanti', 'Gemstone recommendations'] }
                },
                availableDates: 'Any auspicious day, Planet transition days, Purnima, Start of dasha periods',
                whatIsDosha: 'When multiple planets are weak, afflicted, or malefically placed in a horoscope, the combined effect creates obstacles in various life areas. Instead of individual planet remedies, Navgraha Puja addresses all nine celestial bodies—Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu—simultaneously.',
                whyPuja: 'The Navgraha Puja creates planetary harmony by invoking all nine planets with their specific mantras, colors, and offerings. When all grahas are pleased simultaneously, they work together favorably rather than causing conflicts in life.',
                whatWillBeDone: 'Ganapati Puja → Navgraha Mandala creation with grains → Individual graha installation → Graha-specific archana with their colors and flowers → 108/1008 mantra japa for each → Navgraha Homam with 9 types of grains → Aarti to all planets → Graha-specific donations',
                whatYouReceive: ['Complete ceremony video', 'Navgraha Yantra (energized)', 'Certificate with planetary positions', '9 types of prasad', 'Personalized daily graha shanti routine', 'Strong and weak planet report'],
                importantDays: 'Sundays (Sun), Mondays (Moon), Tuesdays (Mars), etc. for specific planets. For overall Navgraha puja, Purnima, Ekadashi, or start of favorable planetary periods are ideal.',
                samagri: 'Nine types of grains, nine colors of flowers, nine types of sweets, nine cloth pieces, ghee, honey, and specific items for each planet (copper for Sun, silver for Moon, etc.)',
                preparation: 'Light fast recommended. Wear white or yellow clothes. Have your birth details ready. Prepare list of life areas needing improvement for sankalp.',
                faqs: [
                    { question: 'Is Navgraha puja better than individual planet pujas?', answer: 'For multiple afflictions, yes. For single strong dosha (like Sade Sati), targeted puja is recommended first, then Navgraha for overall balance.' },
                    { question: 'How often should this be done?', answer: 'Once a year during Purnima or on your birthday (as per Hindu calendar) is ideal for maintenance.' },
                    { question: 'Will this help if I don\'t know my exact birth time?', answer: 'Yes, the puja benefits regardless. Accurate birth time helps in specific sankalp but is not mandatory.' }
                ],
                details: 'Complete Navgraha Dosha Nivaran addressing all 9 planets for holistic life improvement.',
                remedies: ['Navgraha Homam', 'Visit Kumbakonam Navagraha temples', 'Donate to causes related to weak planets', 'Wear recommended gemstones'],
                displayOrder: 6
            },
            {
                name: 'Guru Chandal / Rahu-Jupiter Dosha Shanti Puja',
                slug: 'guru-chandal-dosha',
                icon: '📚',
                description: 'Remedy for Guru Chandal yoga causing wisdom blocks, financial issues, and reputation problems',
                duration: '2-3 hours specialized Guru-Rahu Shanti',
                mode: 'Temple e-puja / Virtual homam',
                recommendedWhen: [
                    'Jupiter conjunct or aspected by Rahu in horoscope',
                    'Guru Chandal Yoga during current transit',
                    'Defamation or false accusations',
                    'Blocked education or career growth despite talent'
                ],
                whoPerforms: 'Senior pandits specialized in Rahu and Guru (Jupiter) graha shanti',
                locationOptions: ['Pushkar Brahma Temple', 'Thirunallar', 'Varanasi', 'Virtual from Jupiter/Rahu temples'],
                inclusions: [
                    'Guru Chandal analysis',
                    'Separate Guru and Rahu Shanti',
                    'Guru Maha Mantra Japa',
                    'Rahu Kavacham',
                    'Combined Shanti Homam',
                    'HD video and e-certificate'
                ],
                price: 2500,
                pricingTiers: {
                    basic: { price: 2500, label: 'Basic', features: ['Guru Chandal Shanti Puja', 'Basic japa', 'Video recording'] },
                    standard: { price: 4100, label: 'Standard', features: ['Full Guru + Rahu Shanti', '19,000 Guru mantra + 18,000 Rahu mantra', 'HD video', 'Prasad'] },
                    premium: { price: 7100, label: 'Premium', features: ['Elaborate Guru Chandal Nivaran Homam', 'Vishnu Sahasranama', 'Yellow sapphire + Hessonite energization', 'Teacher/mentor donation', 'Quarterly follow-up'] }
                },
                availableDates: 'Thursdays (Guru), Wednesdays or Saturdays (Rahu), Guru Pushya Nakshatra',
                whatIsDosha: 'Guru Chandal Yoga forms when Jupiter (Guru—the planet of wisdom, dharma, and fortune) conjoins or is closely aspected by Rahu (the shadowy, deceptive planet). This creates confusion in judgment, obstacles in education, challenges with teachers/mentors, and sometimes false accusations or reputation damage.',
                whyPuja: 'This puja separates the energies of Jupiter and Rahu, strengthening Jupiter\'s positive influence while pacifying Rahu\'s disruptive tendencies. Jupiter regains its role as the great benefic, restoring wisdom, fortune, and dharmic path.',
                whatWillBeDone: 'Ganapati Puja → Guru (Jupiter) graha sthapana → Rahu graha sthapana → Guru mantra japa (19,000) → Rahu mantra japa (18,000) → Combined Guru-Rahu Shanti Homam → Vishnu Sahasranama (for Jupiter strength) → Donations to Brahmins/teachers',
                whatYouReceive: ['Complete puja video', 'Guru Yantra + Rahu Yantra', 'E-certificate', 'Prasad: Yellow items, durva grass, sandalwood', 'Gemstone recommendation report'],
                importantDays: 'Thursdays are primary for Jupiter. Saturdays or Rahu Kaal times can be used for Rahu shanti. Guru Pushya Yoga days are especially powerful.',
                samagri: 'Yellow flowers, turmeric, chana dal, yellow cloth, ghee, banana for Guru. Black sesame, mustard oil, urad dal, blue flowers for Rahu. Arranged by pandit.',
                preparation: 'Fast on Thursday before puja. Wear yellow clothes. If possible, feed a teacher or Brahmin on that day. Maintain respectful attitude toward elders.',
                faqs: [
                    { question: 'What is Guru Chandal transit?', answer: 'When Jupiter and Rahu are in the same sign during their cosmic transit (happens every few years), everyone experiences some Guru Chandal effects. Natal Guru Chandal is stronger.' },
                    { question: 'Can this dosha be completely removed?', answer: 'The puja significantly reduces negative effects. Self-discipline, respecting teachers, and honest conduct further mitigate the yoga.' },
                    { question: 'Should I wear yellow sapphire?', answer: 'Only after proper astrological consultation. Strengthening Jupiter through gems and puja together gives best results.' }
                ],
                details: 'Guru Chandal Yoga Nivaran for Jupiter-Rahu affliction causing wisdom and fortune blocks.',
                remedies: ['Guru Chandal Shanti Homam', 'Donate to education causes', 'Respect teachers and elders', 'Recite Vishnu Sahasranama on Thursdays'],
                displayOrder: 7
            },
            {
                name: 'Chandra / Moon Dosha Shanti Puja',
                slug: 'chandra-dosha',
                icon: '🌙',
                description: 'Remedy for Moon affliction causing emotional instability, mental stress, and relationship troubles',
                duration: '2 hours Chandra Shanti Puja',
                mode: 'Temple e-puja / Virtual homam',
                recommendedWhen: [
                    'Moon afflicted by Rahu, Ketu, or Saturn in horoscope',
                    'Emotional instability and mood swings',
                    'Mental health concerns, anxiety, depression',
                    'Troubled relationship with mother or women'
                ],
                whoPerforms: 'Vedic pandits specializing in Chandra graha shanti and mental peace rituals',
                locationOptions: ['Somnath Temple', 'Chandreshwar Temple', 'Brahmagiri Someshwar', 'Virtual from any Shiva temple'],
                inclusions: [
                    'Chandra graha analysis',
                    'Chandra Shanti Puja',
                    'Chandra Beej Mantra Japa (11,000)',
                    'Shiv Abhishek with milk',
                    'Durga Mantra for mother\'s blessings',
                    'Video and prasad'
                ],
                price: 1800,
                pricingTiers: {
                    basic: { price: 1800, label: 'Basic', features: ['Chandra Shanti Puja', '5,000 mantra japa', 'Video recording'] },
                    standard: { price: 3000, label: 'Standard', features: ['Full Chandra Shanti', '11,000 japa', 'Shiv Abhishek', 'HD video', 'Prasad courier'] },
                    premium: { price: 5100, label: 'Premium', features: ['Elaborate Chandra Dosha Nivaran Homam', '21,000 japa', 'Psychiatric healing mantras', 'Pearl energization', 'Monthly Purnima follow-up'] }
                },
                availableDates: 'Mondays, Purnima (Full Moon), Chitra or Rohini Nakshatra days',
                whatIsDosha: 'Moon governs mind, emotions, mother, and mental peace. When Moon is afflicted by Rahu (creating Grahan Yoga), Saturn (causing depression), or is in debilitation, emotional and mental challenges arise. Relationship with mother and women in general may be troubled.',
                whyPuja: 'Chandra Shanti Puja strengthens the Moon, invoking its calm, nurturing energy. Milk abhishek to Shiva (who wears the crescent moon) and Chandra mantras restore mental equilibrium and emotional stability.',
                whatWillBeDone: 'Ganapati Puja → Chandra graha sthapana → Shiva invocation → Rudrabhishek with milk, water, curd → Chandra Beej Mantra Japa → Chandra Kavacham → Durga Stotra (for mother energy) → Aarti → Donation of rice and white items',
                whatYouReceive: ['Complete puja video', 'Energized Chandra Yantra or silver Moon', 'Prasad: Rice, white flowers, silver coin', 'E-certificate', 'Mental peace mantra card'],
                importantDays: 'Mondays are primary. Purnima (Full Moon) is most powerful for Chandra Shanti. Shravan month Mondays are especially auspicious.',
                samagri: 'White flowers, rice, milk, curd, camphor, white cloth, silver items, sandalwood paste. All arranged by pandit for the puja.',
                preparation: 'Light fast on Monday (milk and fruits). Wear white or silver-colored clothes. If possible, serve or honor your mother on that day. Calm mind is essential.',
                faqs: [
                    { question: 'Can this help with clinical depression or anxiety?', answer: 'The puja provides spiritual support. Please continue medical treatment and use this as complementary healing.' },
                    { question: 'I have troubled relationship with mother—will this help?', answer: 'Yes, Chandra Shanti harmonizes the maternal relationship. Combine with conscious effort to improve the bond.' },
                    { question: 'Should I wear pearl for Moon?', answer: 'Only if Moon is favorable but weak. For afflicted Moon, puja first, then pearl after dosha is reduced.' }
                ],
                details: 'Chandra Dosha Nivaran for Moon affliction causing emotional and mental challenges.',
                remedies: ['Chandra Shanti Puja', 'Offer water to Shiva on Mondays', 'Respect and serve mother', 'Meditate during moonrise'],
                displayOrder: 8
            },
            {
                name: 'Gandmool / Nakshatra Shanti Puja',
                slug: 'gandmool-nakshatra',
                icon: '⭐',
                description: 'Remedy for birth in Gandmool Nakshatra causing health and fortune concerns in infants/children',
                duration: '1.5-2 hours Nakshatra Shanti',
                mode: 'Temple e-puja / Home visit recommended for infants',
                recommendedWhen: [
                    'Child born in Ashwini, Ashlesha, Magha, Jyeshtha, Moola, or Revati Nakshatra',
                    'Health issues in newborn or infant',
                    'Concerns about child\'s fortune and protection',
                    'Traditional family requirement for Gandmool Shanti'
                ],
                whoPerforms: 'Experienced pandits specializing in child-related rituals and Nakshatra Shanti',
                locationOptions: ['Home (recommended for infants)', 'Local temple', 'Virtual with family participation'],
                inclusions: [
                    'Nakshatra identification and analysis',
                    'Child sankalp with parent details',
                    'Nakshatra Devta Puja',
                    'Protective mantra japa',
                    'Brahmin bhojan',
                    'Blessed protection items'
                ],
                price: 1500,
                pricingTiers: {
                    basic: { price: 1500, label: 'Basic', features: ['Gandmool Shanti Puja', 'Basic Nakshatra balancing', 'Video recording'] },
                    standard: { price: 2500, label: 'Standard', features: ['Complete Nakshatra Shanti', 'Nakshatra lord puja', '11,000 protective mantras', 'Blessed locket for child'] },
                    premium: { price: 4100, label: 'Premium (Home Visit)', features: ['Pandit home visit', 'Elaborate Gandmool Shanti Homam', 'Family participation', 'Gold coin protection item', 'Monthly child blessing pujas for first year'] }
                },
                availableDates: 'Within 27 days of birth is traditional. Otherwise, child\'s same Nakshatra day monthly',
                whatIsDosha: 'Gandmool Nakshatra refers to six Nakshatras at the junction of fire signs—Ashwini, Ashlesha, Magha, Jyeshtha, Moola, and Revati. Births in these stars are considered inauspicious in traditional astrology, potentially affecting the child\'s or parents\' health and fortune. The intensity varies by Nakshatra and pada.',
                whyPuja: 'Gandmool Shanti neutralizes any negative birth-time influences by invoking the Nakshatra lord and performing protective rituals. The puja seeks divine protection for the child and family, ensuring the child\'s positive potential manifests fully.',
                whatWillBeDone: 'Ganapati Puja → Nakshatra Devta invocation based on child\'s star → Parent and child sankalp → Nakshatra-specific mantra japa → Protective Kavacham recitation → Balak Rakhsha Mantra → Homam (if elaborate) → Brahmin bhojan → Blessing of protection items',
                whatYouReceive: ['Complete puja video', 'Blessed protection locket/kavach for child', 'Nakshatra analysis report', 'Prasad for parents and child', 'Child protection mantra card'],
                importantDays: 'Traditionally done on 27th day after birth (Nakshatra return). If missed, same Nakshatra day in any month. Pratipada tithi is also favorable.',
                samagri: 'Rice, wheat, ghee, honey, gold or silver coin for baby, specific fruits and sweets for the Nakshatra lord. Arranged by pandit.',
                preparation: 'Parents may fast (optional given infant care duties). Baby should be clean and comfortable. Have exact birth time and Nakshatra details ready.',
                faqs: [
                    { question: 'Is Gandmool Nakshatra really inauspicious?', answer: 'Many great personalities were born in these stars. The puja removes any negative potential while retaining the star\'s positive qualities like leadership and dynamism.' },
                    { question: 'What if we missed the 27th day?', answer: 'The puja can be done anytime. Better late than never. Effectiveness remains.' },
                    { question: 'Should both parents be present?', answer: 'At least one parent must be present for sankalp. Both is ideal. Baby can be in another room with camera focused on puja.' }
                ],
                details: 'Gandmool Nakshatra Shanti for infants born in challenging birth stars for protection and prosperity.',
                remedies: ['Gandmool Shanti within 27 days', 'Donate cow or cow feed', 'Nakshatra lord puja annually', 'Protection kavach for child'],
                displayOrder: 9
            },
            {
                name: 'Shrapit Dosha / Rahu-Shani Shanti Puja',
                slug: 'shrapit-dosha',
                icon: '🔮',
                description: 'Remedy for Shrapit Yoga (curse patterns) causing repeated failures and karmic obstacles',
                duration: '3-4 hours elaborate Shrapit Nivaran',
                mode: 'Temple e-puja at powerful temples / Virtual homam',
                recommendedWhen: [
                    'Rahu and Saturn conjunct in horoscope',
                    'Repeated failures in same life area despite efforts',
                    'Feeling of being \'cursed\' or extremely unlucky',
                    'Ancestral secrets or family pattern breaking'
                ],
                whoPerforms: 'Senior tantric-trained Vedic pandits with expertise in Rahu-Shani remedies and Pitru karya',
                locationOptions: ['Kal Bhairav Temple Varanasi', 'Thirunallar (Saturn)', 'Shani Shingnapur', 'Virtual with temple connection'],
                inclusions: [
                    'Shrapit Yoga analysis',
                    'Rahu and Shani Shanti separately',
                    'Pitru Tarpan component',
                    'Curse-breaking mantras',
                    'Daan (donations) on your behalf',
                    'Full video and protection items'
                ],
                price: 3500,
                pricingTiers: {
                    basic: { price: 3500, label: 'Basic', features: ['Shrapit Dosha Puja', 'Rahu-Shani Shanti', 'Video recording'] },
                    standard: { price: 5500, label: 'Standard', features: ['Full Shrapit Yoga Nivaran Homam', 'Pitru Tarpan', '18,000 Rahu + 23,000 Shani mantra', 'HD video'] },
                    premium: { price: 11000, label: 'Premium', features: ['Kal Bhairav Temple Varanasi ritual', 'Complete ancestral healing', 'Protection tantric rituals', '108 Brahmin bhojan', 'Iron/leather/mustard oil daan', 'Quarterly follow-up'] }
                },
                availableDates: 'Saturdays (primary), Amavasya, Rahu Kaal time, Kalashtami',
                whatIsDosha: 'Shrapit Dosha or Shrapit Yoga forms when Rahu and Saturn conjoin in a horoscope. In Vedic astrology, this is considered indicative of past-life curses (Shrapit means cursed). It manifests as repeated failures in specific life areas, obstacles that others don\'t face, and a feeling of sabotage by fate.',
                whyPuja: 'The Shrapit Nivaran Puja addresses both the Rahu-Shani conjunction and any ancestral karmic patterns. By propitiating the two most challenging planets together and seeking forgiveness from ancestors, the curse-patterns are broken and new opportunities emerge.',
                whatWillBeDone: 'Ganapati Puja → Shani graha puja and abhishek → Rahu graha puja → Pitru Tarpan (ancestral healing) → Shrapit Dosha Nivaran Mantra Japa → Combined Rahu-Shani Homam → Kurma (tortoise) Daan (symbolic) → Brahmin bhojan → Mustard oil and iron donation',
                whatYouReceive: ['Complete ceremony video', 'Shani + Rahu Yantras', 'Energized protection bracelet', 'Ancestral peace certificate', 'Prasad: Black items, til, iron ring'],
                importantDays: 'Saturdays are essential (Shani\'s day). Amavasya Saturdays most powerful. Shani Jayanti and during Rahu Kaal for additional effect.',
                samagri: 'Black sesame, mustard oil, iron items, urad dal, blue and black flowers, tortoise replica, seven grains for ancestors. All arranged by pandit.',
                preparation: 'Strict fast on puja day (urad dal meal in evening allowed). Wear only blue or black. Before puja, silently ask forgiveness from anyone you may have wronged. Donate to disabled persons on Saturdays before puja.',
                faqs: [
                    { question: 'Why is it called a "curse"?', answer: 'It\'s a karmic pattern from past actions (this or previous lives) that creates repeated obstacles. "Curse" is a traditional term for this karmic debt.' },
                    { question: 'Can one puja remove all Shrapit effects?', answer: 'The puja breaks the pattern. Consistent good karma, Saturn-pleasing activities, and periodic follow-up pujas ensure lasting relief.' },
                    { question: 'I don\'t believe in past lives—will the puja still help?', answer: 'Yes, the puja addresses the current Rahu-Shani conjunction regardless of past-life beliefs. The planetary energy balancing works universally.' }
                ],
                details: 'Powerful Shrapit Yoga Nivaran for Rahu-Shani conjunction causing curse-like repeated obstacles.',
                remedies: ['Shrapit Dosha Nivaran Puja', 'Serve disabled and poor on Saturdays', 'Feed crows for ancestors', 'Accept Saturn\'s lessons with patience'],
                displayOrder: 10
            }
        ];

        for (const dosha of doshas) {
            const [record, created] = await Dosha.findOrCreate({
                where: { slug: dosha.slug },
                defaults: dosha
            });
            if (!created) {
                // Update existing record with new fields
                await record.update(dosha);
            }
        }
        console.log('Doshas seeded/updated successfully');

        // Seed e-Pujas (keeping existing)
        const epujas = [
            {
                name: 'Live Temple Pujas',
                slug: 'live-temple-pujas',
                icon: '🛕',
                tag: 'Popular',
                description: 'Participate in pujas from famous temples across India remotely',
                details: 'Watch and participate in live pujas from renowned temples like Tirupati, Shirdi, Vaishno Devi, and more. Receive prasad at your doorstep.',
                features: ['Tirupati Balaji', 'Shirdi Sai Baba', 'Vaishno Devi', 'Siddhivinayak'],
                price: 1100,
                priceType: 'starting',
                displayOrder: 1
            },
            {
                name: 'Personalized e-Puja',
                slug: 'personalized-epuja',
                icon: '📱',
                tag: 'New',
                description: 'Custom puja performed by pandit on video call with your presence',
                details: 'One-on-one puja session with a verified pandit via video call. Participate in real-time, ask questions, and receive personalized blessings.',
                features: ['Live Video Call', 'Personal Sankalp', 'Real-time Mantras', 'Digital Recording'],
                price: 2100,
                priceType: 'starting',
                displayOrder: 2
            },
            {
                name: 'Daily Sankalp',
                slug: 'daily-sankalp',
                icon: '🌅',
                tag: 'Subscription',
                description: 'Daily prayers and archana performed on your behalf',
                details: 'Subscribe to daily prayers where a pandit performs archana, lights diya, and does sankalp in your name every morning.',
                features: ['Daily Morning Puja', 'Weekly Reports', 'Festival Special Pujas', 'Family Coverage'],
                price: 999,
                priceType: 'monthly',
                displayOrder: 3
            },
            {
                name: 'Festival Special Pujas',
                slug: 'festival-special',
                icon: '🪔',
                tag: 'Seasonal',
                description: 'Special pujas during Navratri, Diwali, Shivratri, and other festivals',
                details: 'Participate in elaborate pujas conducted during major Hindu festivals. Perfect for those away from home during festivals.',
                features: ['Navratri', 'Diwali Lakshmi Puja', 'Maha Shivratri', 'Ganesh Chaturthi'],
                price: 1500,
                priceType: 'starting',
                displayOrder: 4
            },
            {
                name: 'Satyanarayan Katha e-Puja',
                slug: 'satyanarayan-katha',
                icon: '📿',
                tag: 'Popular',
                description: 'Complete Satyanarayan Puja via video conference',
                details: 'Full Satyanarayan Katha performed virtually with your family participation. Includes all rituals and katha narration.',
                features: ['Complete Katha', 'All Mantras', 'Prasad Delivery', 'Family Participation'],
                price: 2500,
                priceType: 'fixed',
                displayOrder: 5
            },
            {
                name: 'Ancestor Rituals Online',
                slug: 'ancestor-rituals',
                icon: '🕯️',
                tag: null,
                description: 'Tarpan and Shradh ceremonies performed at sacred ghats',
                details: 'Pitra Tarpan and Shradh rituals performed at sacred locations like Haridwar, Varanasi, or Gaya with live streaming.',
                features: ['Har Ki Pauri, Haridwar', 'Dashashwamedh Ghat, Varanasi', 'Vishnupad Temple, Gaya'],
                price: 3000,
                priceType: 'starting',
                displayOrder: 6
            }
        ];

        for (const epuja of epujas) {
            await EPuja.findOrCreate({
                where: { slug: epuja.slug },
                defaults: epuja
            });
        }
        console.log('e-Pujas seeded successfully');

    } catch (error) {
        console.error('Error seeding doshas/epujas:', error);
    }
}

module.exports = seedDoshasAndEPujas;

// Run if called directly
if (require.main === module) {
    require('dotenv').config();
    const sequelize = require('./config/database');
    sequelize.authenticate().then(() => {
        return sequelize.sync({ alter: true });
    }).then(() => {
        return seedDoshasAndEPujas();
    }).then(() => {
        console.log('Seeding complete');
        process.exit(0);
    }).catch(err => {
        console.error('Seeding failed:', err);
        process.exit(1);
    });
}
