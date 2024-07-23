import React, { useState } from "react";
import { motion } from "framer-motion";

interface Theme {
  name: string;
  creatorLogo: string;
  creatorName: string;
  category: string;
  visibility: string;
  likes: number;
}

interface ThemeCardProps {
  theme: Theme;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme }) => {
  const [likes, setLikes] = useState<number>(theme.likes);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {theme.name}
        </h1>

        <div className="flex items-center space-x-3">
          <img
            src={theme.creatorLogo}
            alt="Creator logo"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-white font-medium">{theme.creatorName}</p>
            <p className="text-gray-400 text-sm">Theme Creator</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              <i className="fas fa-folder mr-2"></i>Category
            </span>
            <span className="text-white font-medium">{theme.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              <i className="fas fa-eye mr-2"></i>Visibility
            </span>
            <span className="text-white font-medium">{theme.visibility}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              <i className="fas fa-heart mr-2"></i>Likes
            </span>
            <motion.span
              className="text-white font-medium"
              key={likes}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {likes}
            </motion.span>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
          >
            <i className="fas fa-heart mr-2"></i>Like
          </motion.button>
          <button className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300">
            <i className="fas fa-download mr-2"></i>Download
          </button>
          <button className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-300">
            <i className="fas fa-edit mr-2"></i>Edit
          </button>
          <button className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300">
            <i className="fas fa-share mr-2"></i>Share
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeCard;
