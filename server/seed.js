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
                basePrice: 2500,
                videos: ['https://www.w3schools.com/html/mov_bbb.mp4'],
                reviews: [
                    { user: 'Ramesh G.', rating: 5, comment: 'Excellent Pandit ji, very divine experience.' }
                ]
            },
            {
                slug: 'grihapravesh',
                title: 'Griha Pravesh',
                icon: '🏠',
                image: 'https://images.unsplash.com/photo-1582560475093-d09bc3020994?q=80&w=1000&auto=format&fit=crop',
                description: 'Griha Pravesh is a Hindu ceremony performed on the occasion of an individual\'s first entry into their new home.',
                samagri: ['Coconut', 'Rice', 'Milk', 'Jaggery', 'Flowers', 'Incense Sticks', 'Camphor', 'Turmeric', 'Kumkum'],
                process: ['Dwar Puja', 'Boiling of Milk', 'Ganesh Puja', 'Vastu Shanti', 'Havan', 'Kitchen Puja'],
                basePrice: 5000,
                videos: [],
                reviews: []
            },
            {
                slug: 'naamkaranam',
                title: 'Naamkaranam',
                icon: '👶',
                image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
                description: 'Naamkaranam is the traditional Hindu naming ceremony performed to select a newborn\'s name using astrological rules.',
                samagri: ['Honey', 'Curd', 'Ghee', 'Betel leaves', 'Flowers', 'Turmeric', 'Kumkum', 'New clothes for baby'],
                process: ['Ganapathi Puja', 'Punyaha Vachanam', 'Kalash Puja', 'Naming Ritual', 'Blessings'],
                basePrice: 2000,
                videos: [],
                reviews: []
            },
            {
                slug: 'ganapathi-puja',
                title: 'Ganapathi Puja',
                icon: '🐘',
                image: 'https://images.unsplash.com/photo-1567591414240-e2152d0a395d?q=80&w=1000&auto=format&fit=crop',
                description: 'Worship of Lord Ganesha, the remover of obstacles, performed before starting any new venture or ceremony.',
                samagri: ['Modak', 'Durva Grass', 'Red Flowers', 'Coconut', 'Incense', 'Camphor'],
                process: ['Avahana', 'Prana Pratishtha', 'Shodashopachara Puja', 'Aarti', 'Prasad Distribution'],
                basePrice: 1500,
                videos: [],
                reviews: []
            },
            {
                slug: 'upanayanam',
                title: 'Upanayanam',
                icon: '🧵',
                image: 'https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?q=80&w=1000&auto=format&fit=crop',
                description: 'The sacred thread ceremony that marks the acceptance of a student by a Guru and an individual\'s entrance into the school of Hinduism.',
                samagri: ['Sacred Thread (Yagnopavita)', 'Deer Skin (symbolic)', 'Darbha Grass', 'Firewood for Havan', 'Ghee'],
                process: ['Udaka Shanti', 'Yagnopavita Dharanam', 'Brahmopadesam', 'Bhiksha Vandanam'],
                basePrice: 7500,
                videos: [],
                reviews: []
            },
            {
                slug: 'bhumi-puja',
                title: 'Bhumi Puja',
                icon: '🏗️',
                image: 'https://images.unsplash.com/photo-1598436327386-74971253443a?q=80&w=1000&auto=format&fit=crop',
                description: 'Worship of Mother Earth (Bhoomi Devi) before beginning construction on a new site to seek blessings and ensure smooth completion.',
                samagri: ['Turmeric', 'Kumkum', 'Five types of fruits', 'Coconut', 'Navaratna (9 gems)', 'Milk'],
                process: ['Ganesh Puja', 'Bhoomi Devi Invocation', 'Digging Ritual', 'Laying Foundation Stone'],
                basePrice: 3500,
                videos: [],
                reviews: []
            },
            {
                slug: 'navagraha-shanti',
                title: 'Navagraha Shanti Homam',
                icon: '🪐',
                image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1000&auto=format&fit=crop',
                description: 'A ritual to appease the nine planets (Navagrahas) and reduce their malefic effects while strengthening benevolent ones.',
                samagri: ['Nine types of grains (Navadhanya)', 'Colored cloth pieces', 'Havan Samagri', 'Ghee', 'Sesame seeds'],
                process: ['Sankalp', 'Kalash Sthapan', 'Navagraha Invocation', 'Havan for each planet', 'Purnahuti'],
                basePrice: 5500,
                videos: [],
                reviews: []
            },
            {
                slug: 'vivah-puja',
                title: 'Vivah Puja',
                icon: '💍',
                image: 'https://images.unsplash.com/photo-1583934555026-17a11f91f378?q=80&w=1000&auto=format&fit=crop',
                description: 'The traditional Hindu wedding ceremony uniting two souls in a sacred bond for seven lifetimes.',
                samagri: ['Garlands', 'Mangalsutra', 'Rice', 'Turmeric', 'Kumkum', 'Coconut', 'Firewood', 'Ghee'],
                process: ['Ganesh Puja', 'Kanyadaan', 'Panigrahan', 'Saptapadi (Seven Steps)', 'Mangalsutra Dharanam'],
                basePrice: 15000,
                videos: [],
                reviews: []
            },
            {
                slug: 'dosha-nivaran',
                title: 'Ketu / Rahu Shanti & Mangal Dosh Nivaran',
                icon: '🔥',
                image: 'https://images.unsplash.com/photo-1515286576717-d26f6068ad05?q=80&w=1000&auto=format&fit=crop',
                description: 'Special pujas to nullify the negative effects of Rahu, Ketu, and Mars (Mangal) in one\'s horoscope.',
                samagri: ['Black Gram', 'Horse Gram', 'Red Lentils', 'Iron/Lead items (symbolic)', 'Red Cloth', 'Black Cloth'],
                process: ['Sankalp', 'Graha Shanti Havan', 'Mantra Japa', 'Dan (Donation)'],
                basePrice: 4500,
                videos: [],
                reviews: []
            },
            {
                slug: 'sashtiapthapoorthi',
                title: 'Sashtiapthapoorthi',
                icon: '🎂',
                image: 'https://images.unsplash.com/photo-1530047625168-4b29bf817008?q=80&w=1000&auto=format&fit=crop',
                description: 'A ceremony celebrated on the completion of 60 years of age, marking a renewal of marital vows.',
                samagri: ['Kalash', 'New Clothes', 'Mangalsutra', 'Gold/Silver coins', 'Havan Samagri'],
                process: ['Ganesh Puja', 'Ayush Homam', 'Kalash Abhishekam', 'Muhurtham (Remarriage ritual)'],
                basePrice: 8000,
                videos: [],
                reviews: []
            },
            {
                slug: 'vahana-puja',
                title: 'Vahana Puja',
                icon: '🚗',
                image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop',
                description: 'Worship of a new vehicle to seek protection from accidents and ensure safe journeys.',
                samagri: ['Lemons', 'Coconut', 'Turmeric', 'Kumkum', 'Flower Garland', 'Camphor'],
                process: ['Cleaning vehicle', 'Drawing Swastik', 'Breaking Coconut', 'Lemon crushing under wheels'],
                basePrice: 1500,
                videos: [],
                reviews: []
            },
            {
                slug: 'business-opening',
                title: 'Business Opening Puja',
                icon: '🏢',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
                description: 'A ceremony performed before opening a new office or shop to invite prosperity and success.',
                samagri: ['Lakshmi Idol/Photo', 'Ganesh Idol', 'Account Books', 'Turmeric', 'Kumkum', 'Sweets'],
                process: ['Ganesh Puja', 'Lakshmi Puja', 'Worship of Account Books/Tools', 'Prasad Distribution'],
                basePrice: 3000,
                videos: [],
                reviews: []
            }
        ];

        await sequelize.models.Ceremony.bulkCreate(ceremonies);

        // Create Page Content
        const pages = [
            {
                slug: 'about-us',
                title: 'About Us',
                content: '<p>Welcome to DivyaKarya, your trusted platform for connecting with experienced Pandits. We aim to bring spiritual services to your doorstep with ease and authenticity.</p><p>Our mission is to preserve and promote Hindu traditions by making them accessible to everyone, everywhere.</p>',
                metaDescription: 'Learn more about DivyaKarya and our mission.'
            },
            {
                slug: 'contact-us',
                title: 'Contact Us',
                content: '<p>Have questions? Reach out to us!</p><ul><li>Email: support@divyakarya.com</li><li>Phone: +91 98765 43210</li><li>Address: 123 Spiritual Way, Hyderabad, India</li></ul>',
                metaDescription: 'Contact DivyaKarya for support and inquiries.'
            },
            {
                slug: 'register-pandit',
                title: 'Register as a Pandit',
                content: '<p>Are you an experienced Pandit? Join our network and reach more devotees.</p><p>Benefits:</p><ul><li>Flexible schedule</li><li>Fair compensation</li><li>Verified platform</li></ul><p>Contact us to start your registration process.</p>',
                metaDescription: 'Join DivyaKarya as a Pandit.'
            },
            {
                slug: 'feedback',
                title: 'Feedback',
                content: '<p>We value your feedback. Please let us know how we can improve your experience.</p><p>Email us at feedback@divyakarya.com</p>',
                metaDescription: 'Share your feedback with DivyaKarya.'
            },
            {
                slug: 'blog',
                title: 'Our Blog',
                content: '<p>Read our latest articles on Hindu traditions, festivals, and spiritual practices.</p><p><em>Coming soon: Weekly articles on Vedic astrology and rituals.</em></p>',
                metaDescription: 'Read the DivyaKarya blog.'
            }
        ];

        await sequelize.models.PageContent.bulkCreate(pages);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
