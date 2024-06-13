import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllCourses,
  getAllChaptersByCourseID,
  addCourse,
  deleteCourse,
  updateCourse,
  addChapter,
  deleteChapter,
  updateChapter,
  getAllCartsbyChapterID,
  getCourseById,
  updateCard,
  deleteCard,
  addCard,
} from "../services/flashcardService";

const FlashcardContext = createContext();

export const FlashcardProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [carts, setCarts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterName, setChapterName] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  const loadChapters = async (courseID) => {
    try {
      const data = await getAllChaptersByCourseID(courseID);
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const loadCarts = async (chapterID) => {
    try {
      const data = await getAllCartsbyChapterID(chapterID);
      setCarts(data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  };

  const addCoursee = async (course) => {
    try {
      const record = await addCourse(course);
      setCourses((prevCourses) => [...prevCourses, record]);
      return record;
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  };

  const deleteCoursee = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  const updateCoursee = async (course) => {
    try {
      const updatedCourse = await updateCourse(course);
      setCourses((prevCourses) =>
        prevCourses.map((c) => (c.id === course.id ? updatedCourse : c))
      );
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const addChapterr = async (courseId, chapter) => {
    try {
      const newChapter = await addChapter(courseId, chapter);
      loadChapters(courseId);
    } catch (error) {
      console.error("Error adding chapter:", error);
      throw error;
    }
  };

  const deleteChapterr = async (courseId, chapterId) => {
    try {
      await deleteChapter(chapterId);
      loadChapters(courseId);
    } catch (error) {
      console.error("Error deleting chapter:", error);
      throw error;
    }
  };

  const updateChapterr = async (id, data) => {
    try {
      const updatedChapter = await updateChapter(id, data);
      loadChapters(data.courseID);
    } catch (error) {
      console.error("Error updating chapter:", error);
      throw error;
    }
  };

  const allCardsByChapterId = async (chapterId) => {
    try {
      const data = await getAllCartsbyChapterID(chapterId);
      return data;
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const getCourseByIdd = async (id) => {
    try {
      const course = await getCourseById(id);
      setChapterName(course.name);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const updateCardd = async (cardId, cardData) => {
    try {
      const updatedCard = await updateCard(cardId, cardData);
      return updatedCard;
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  };

  const deleteCardd = async (cardId) => {
    try {
      await deleteCard(cardId);
      setCarts((prevCarts) => prevCarts.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };
  const addCardd = async (chapterId, card) => {
    try {
      const newCard = await addCard(chapterId, card);
      setCarts((prevCarts) => [...prevCarts, newCard]);
      return newCard;
    } catch (error) {
      console.error("Error adding card:", error);
      throw error;
    }
  };

  return (
    <FlashcardContext.Provider
      value={{
        courses,
        chapters,
        carts,
        selectedCategories,
        setSelectedCategories,
        loadChapters,
        loadCarts,
        loading,
        addCoursee,
        deleteCoursee,
        updateCoursee,
        addChapterr,
        deleteChapterr,
        updateChapterr,
        allCardsByChapterId,
        getCourseByIdd,
        chapterName,
        updateCardd,
        deleteCardd,
        addCardd,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = () => {
  return useContext(FlashcardContext);
};
