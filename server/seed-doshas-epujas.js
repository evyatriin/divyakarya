const { Dosha, EPuja } = require('./models');

async function seedDoshasAndEPujas() {
    try {
        // Seed Doshas
        const doshas = [
            {
                name: 'Manglik Dosha',
                slug: 'manglik-dosha',
                icon: '🔴',
                description: 'Mars affliction in horoscope affecting marriage and relationships',
                details: 'Manglik Dosha occurs when Mars is placed in 1st, 2nd, 4th, 7th, 8th, or 12th house. It can cause delays in marriage and relationship challenges.',
                remedies: ['Mangal Shanti Puja', 'Kumbh Vivah', 'Hanuman Chalisa recitation'],
                duration: '2-3 hours',
                price: 2100,
                displayOrder: 1
            },
            {
                name: 'Kaal Sarp Dosha',
                slug: 'kaal-sarp-dosha',
                icon: '🐍',
                description: 'All planets hemmed between Rahu and Ketu causing life obstacles',
                details: 'This dosha occurs when all seven planets are positioned between Rahu and Ketu. It can bring unexpected challenges and delays in life.',
                remedies: ['Kaal Sarp Shanti Puja', 'Naag Puja at Trimbakeshwar', 'Rahu-Ketu Shanti'],
                duration: '3-4 hours',
                price: 3500,
                displayOrder: 2
            },
            {
                name: 'Pitra Dosha',
                slug: 'pitra-dosha',
                icon: '🙏',
                description: 'Ancestral karma affecting current life prosperity and peace',
                details: 'Pitra Dosha arises from unfulfilled wishes or wrongdoings of ancestors. It can affect health, finances, and family harmony.',
                remedies: ['Pitra Tarpan', 'Shradh Ceremonies', 'Pinda Daan at Gaya'],
                duration: '1-2 hours',
                price: 1500,
                displayOrder: 3
            },
            {
                name: 'Shani Dosha',
                slug: 'shani-dosha',
                icon: '⚫',
                description: 'Saturn affliction causing hardships, delays, and obstacles',
                details: 'Shani Dosha occurs during Sade Sati, Shani Dhaiya, or malefic Saturn placement. It tests patience and brings life lessons.',
                remedies: ['Shani Shanti Puja', 'Til Tel Abhishek', 'Hanuman Puja on Saturdays'],
                duration: '2-3 hours',
                price: 2500,
                displayOrder: 4
            },
            {
                name: 'Grahan Dosha',
                slug: 'grahan-dosha',
                icon: '🌑',
                description: 'Birth during eclipse causing health and mental challenges',
                details: 'If born during a solar or lunar eclipse, this dosha can affect mental peace and overall wellbeing.',
                remedies: ['Grahan Dosha Shanti', 'Mahamrityunjaya Japa', 'Surya/Chandra Puja'],
                duration: '2-3 hours',
                price: 2000,
                displayOrder: 5
            },
            {
                name: 'Nadi Dosha',
                slug: 'nadi-dosha',
                icon: '💫',
                description: 'Matching issue in Kundli affecting marriage compatibility',
                details: 'Nadi Dosha in Kundli matching can indicate health issues for offspring and compatibility challenges.',
                remedies: ['Nadi Dosha Nivaran Puja', 'Maha Mrityunjaya Japa', 'Charitable activities'],
                duration: '2-3 hours',
                price: 2100,
                displayOrder: 6
            }
        ];

        for (const dosha of doshas) {
            await Dosha.findOrCreate({
                where: { slug: dosha.slug },
                defaults: dosha
            });
        }
        console.log('Doshas seeded successfully');

        // Seed e-Pujas
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
    seedDoshasAndEPujas().then(() => process.exit(0));
}
