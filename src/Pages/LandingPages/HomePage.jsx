import React from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaBasketballBall, FaStar, FaMedal } from 'react-icons/fa'

function HomePage() {
  // LeBron's Lakers stats
  const lebronStats = {
    points: 27.4,
    rebounds: 8.1,
    assists: 8.0,
    championships: 1,
    allStar: 6,
    mvp: 1
  }

  return (
    <div className="px-4 sm:px-6 md:px-20 py-8 sm:py-12 bg-gradient-to-b from-[#f8f4ff] to-[#e8e0ff]">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl mb-8 sm:mb-16 shadow-lg md:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#552583]/90 to-[#FDB927]/70 z-10"></div>
        <img 
          src="https://www.jammable.com/cdn-cgi/image/width=3840,quality=25,format=webp/https://imagecdn.voicify.ai/models/ac771e3b-b866-45b8-8eb7-7a23dc89d911.png" 
          alt="LeBron James Lakers" 
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 tracking-tight">
              KING <span className="text-[#FDB927]">JAMES</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold mb-4 sm:mb-6">
              The Ambatukam Legacy Continues
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl">
              Witness the greatness of LeBron James in purple and gold - rewriting history one game at a time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16"
      >
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border-t-4 border-[#552583]">
          <div className="text-[#552583] text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
            <FaBasketballBall className="mr-2 sm:mr-3" /> {lebronStats.points}
          </div>
          <div className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">PPG with Lakers</div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border-t-4 border-[#FDB927]">
          <div className="text-[#552583] text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
            <FaMedal className="mr-2 sm:mr-3" /> {lebronStats.championships}
          </div>
          <div className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Lakers Championships</div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border-t-4 border-[#552583]">
          <div className="text-[#552583] text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
            <FaStar className="mr-2 sm:mr-3" /> {lebronStats.allStar}
          </div>
          <div className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Lakers All-Star Selections</div>
        </div>
      </motion.div>

      {/* Career Highlights */}
      <div className="mb-8 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#552583] mb-6 sm:mb-8 text-center"
        >
          <span className="border-b-4 border-[#FDB927] pb-1 sm:pb-2">LeBron's Lakers Journey</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#552583] mb-2 sm:mb-4 flex items-center">
              <FaTrophy className="text-[#FDB927] mr-2 sm:mr-3" /> 2020 Championship
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Led the Lakers to their 17th NBA championship in the Orlando bubble, earning Finals MVP honors 
              and cementing his legacy as the only player to win Finals MVP with three different franchises.
            </p>
            <img 
              src="https://e0.365dm.com/20/10/2048x1152/skysports-lebron-james-anthony-davis_5138168.jpg?20201014102448" 
              alt="LeBron 2020 Championship" 
              className="mt-3 sm:mt-4 rounded-lg w-full h-40 sm:h-48 object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#552583] mb-2 sm:mb-4">Scoring King</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Surpassed Kareem Abdul-Jabbar to become the NBA's all-time leading scorer while wearing the 
              purple and gold, further solidifying his place among basketball's immortals.
            </p>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgrRr6HKPhLCNiJSMLqlLxBSgBeqz_Bda1XQ&s" 
              alt="LeBron scoring record" 
              className="mt-3 sm:mt-4 rounded-lg w-full h-40 sm:h-48 object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Image Gallery */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-16"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        {[
          'https://i.tribune.com.pk/media/images/images-(5)1727073532-0/images-(5)1727073532-0.jpg',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXZ0uSnO4MMuYDry0btu_7UGwTa-i8ABkDOEHoSBXoCPBCYx28gjhwZh7bNUtNH9Ba5M&usqp=CAU',
          'https://media.tenor.com/_H7kYoh8pVsAAAAM/boom-boom-boom.gif',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1YWlwaAUMZjSfOoMP1WFo0kABx_adjutUw&s'
        ].map((img, index) => (
          <motion.div
            key={index}
            className="aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={img} 
              alt={`LeBron Lakers ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Legacy Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="bg-[#552583] text-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center">
          <span className="border-b-4 border-[#FDB927] pb-1 sm:pb-2">The Lakers Legacy</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-4xl mx-auto">
          LeBron James' time with the Lakers has added another legendary chapter to both his storied career 
          and the franchise's rich history. From breaking records to mentoring young stars, his impact extends 
          far beyond the court. As he continues to defy age and expectations, Lakers fans worldwide cherish 
          every moment of witnessing greatness in purple and gold.
        </p>
        <div className="text-[#FDB927] text-lg sm:text-xl md:text-2xl font-bold mt-6 sm:mt-8 text-center">
          #ILoveLebron23 #KingJames #LeDaddyLovesMe
        </div>
      </motion.div>
    </div>
  )
}

export default HomePage