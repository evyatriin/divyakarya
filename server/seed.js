require('dotenv').config();
const sequelize = require('./config/database');
const { User, Pandit, Booking } = require('./models');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create User
        await User.create({
            name: 'Rahul Sharma',
            email: 'user@example.com',
            password: hashedPassword,
            phone: '9876543210',
            role: 'user'
        });

        // Create Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            phone: '9999999999',
            role: 'admin'
        });

        // Create Pandit
        await Pandit.create({
            name: 'Pandit Ji',
            email: 'pandit@example.com',
            password: hashedPassword,
            phone: '8888888888',
            specialization: 'Satyanarayan Puja, Griha Pravesh',
            experience: 15,
            isOnline: true,
            isVerified: true
        });

        // Create Ceremonies
        const ceremonies = [
            {
                slug: 'satyanarayan',
                title: 'Satyanarayan Puja',
                icon: '🕉️',
                image: 'https://images.unsplash.com/photo-1609105537365-21f4d227d827?q=80&w=1000&auto=format&fit=crop',
                description: 'The Satyanarayan Puja is a religious worship of the Hindu god Vishnu. Satya means "Truth" and Narayana means, "The highest being".',
                samagri: ['Kumkum', 'Turmeric', 'Rice', 'Betel Leaves', 'Betel Nuts', 'Flowers', 'Fruits', 'Milk', 'Yogurt', 'Honey', 'Ghee', 'Sugar'],
                process: ['Sankalp (Vow)', 'Ganesh Puja', 'Kalash Sthapan', 'Navagraha Puja', 'Satyanarayan Katha', 'Havan', 'Aarti'],
                videos: ['https://www.w3schools.com/html/mov_bbb.mp4', 'https://www.w3schools.com/html/movie.mp4'],
                reviews: [
                    { user: 'Ramesh G.', rating: 5, comment: 'Excellent Pandit ji, very divine experience.' },
                    { user: 'Suresh K.', rating: 4, comment: 'Good ceremony, started on time.' }
                ],
                translations: {
                    te: {
                        title: 'సత్యనారాయణ పూజ',
                        description: 'సత్యనారాయణ పూజ హిందూ దేవుడైన విష్ణువు యొక్క మతపరమైన ఆరాధన. సత్య అంటే "నిజం" మరియు నారాయణ అంటే "అత్యున్నత జీవి".',
                        samagri: ['కుంకుమ', 'పసుపు', 'బియ్యం', 'తమలపాకులు', 'వక్కలు', 'పూలు', 'పండ్లు', 'పాలు', 'పెరుగు', 'తేనె', 'నెయ్యి', 'చక్కెర'],
                        process: ['సంకల్పం', 'గణపతి పూజ', 'కలశ స్థాపన', 'నవగ్రహ పూజ', 'సత్యనారాయణ కథ', 'హోమం', 'హారతి']
                    },
                    ta: {
                        title: 'சத்யநாராயண பூஜை',
                        description: 'சத்யநாராயண பூஜை என்பது விஷ்ணு பகவானின் மத வழிபாபாடாகும். சத்யா என்றால் "உண்மை" மற்றும் நாராயணா என்றால் "உயர்ந்தவர்".',
                        samagri: ['குங்குமம்', 'மஞ்சள்', 'அரிசி', 'வெற்றிலை', 'பாக்கு', 'பூக்கள்', 'பழங்கள்', 'பால்', 'தயிர்', 'தேன்', 'நெய்', 'சர்க்கரை'],
                        process: ['சங்கல்பம்', 'கணபதி பூஜை', 'கலச ஸ்தாபனம்', 'நவகிரக பூஜை', 'சத்யநாராயண கதை', 'ஹோமம்', 'ஆர்த்தி']
                    }
                }
            },
            {
                slug: 'grihapravesh',
                title: 'Griha Pravesh',
                icon: '🏠',
                image: 'https://images.unsplash.com/photo-1582560475093-d09bc3020994?q=80&w=1000&auto=format&fit=crop',
                description: 'Griha Pravesh is a Hindu ceremony performed on the occasion of an individual\'s first entry into their new home.',
                samagri: ['Coconut', 'Rice', 'Milk', 'Jaggery', 'Flowers', 'Incense Sticks', 'Camphor', 'Turmeric', 'Kumkum'],
                process: ['Dwar Puja', 'Boiling of Milk', 'Ganesh Puja', 'Vastu Shanti', 'Havan', 'Kitchen Puja'],
                videos: ['https://www.w3schools.com/html/mov_bbb.mp4'],
                reviews: [
                    { user: 'Priya M.', rating: 5, comment: 'Very professional and traditional.' }
                ],
                translations: {
                    te: {
                        title: 'గృహ ప్రవేశం',
                        description: 'గృహ ప్రవేశం అనేది ఒక వ్యక్తి తన కొత్త ఇంటికి మొదటిసారి ప్రవేశించిన సందర్భంగా నిర్వహించే హిందూ వేడుక.',
                        samagri: ['కొబ్బరికాయ', 'బియ్యం', 'పాలు', 'బెల్లం', 'పూలు', 'అగర్బత్తులు', 'కర్పూరం', 'పసుపు', 'కుంకుమ'],
                        process: ['ద్వార పూజ', 'పాలు పొంగించడం', 'గణపతి పూజ', 'వాస్తు శాంతి', 'హోమం', 'వంటగది పూజ']
                    },
                    ta: {
                        title: 'கிருக பிரவேசம்',
                        description: 'கிருக பிரவேசம் என்பது ஒரு நபர் தனது புதிய வீட்டிற்குள் முதன்முதலில் நுழைவதைக் குறிக்கும் இந்து விழாவாகும்.',
                        samagri: ['தேங்காய்', 'அரிசி', 'பால்', 'வெல்லம்', 'பூக்கள்', 'ஊதுவத்தி', 'கற்பூரம்', 'மஞ்சள்', 'குங்குமம்'],
                        process: ['துவார பூஜை', 'பால் காய்ச்சுதல்', 'கணபதி பூஜை', 'வாஸ்து சாந்தி', 'ஹோமம்', 'சமையலறை பூஜை']
                    }
                }
            },
            // ... (Other ceremonies can be added similarly, keeping it short for now)
        ];

        await sequelize.models.Ceremony.bulkCreate(ceremonies);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
