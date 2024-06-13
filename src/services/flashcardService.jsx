import pb from "./PocketbaseService";

export const getAllCourses = async () => {
  try {
    const records = await pb.collection("courses").getFullList({
      sort: "-created",
    });
    return records;
  } catch (error) {
    throw error;
  }
};

export const getAllChaptersByCourseID = async (id) => {
  try {
    const records = await pb.collection("chapters").getFullList({
      filter: `courseID= "${id}"`,
    });
    return records;
  } catch (error) {
    throw error;
  }
};

export const addCourse = async (course) => {
  try {
    const record = await pb.collection("courses").create(course);
    return record;
  } catch (error) {
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await pb.collection("courses").delete(courseId);
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (course) => {
  try {
    const record = await pb.collection("courses").update(course.id, course);
    return record;
  } catch (error) {
    throw error;
  }
};

export const addChapter = async (courseId, chapter) => {
  try {
    const record = await pb.collection("chapters").create({
      ...chapter,
      courseID: courseId,
    });
    return record;
  } catch (error) {
    throw error;
  }
};

export const deleteChapter = async (chapterId) => {
  try {
    await pb.collection("chapters").delete(chapterId);
  } catch (error) {
    throw error;
  }
};

export const updateChapter = async (id, chapter) => {
  try {
    const record = await pb.collection("chapters").update(id, chapter);
    return record;
  } catch (error) {
    throw error;
  }
};

export const getAllCartsbyChapterID = async (id) => {
  try {
    const records = await pb.collection("carts").getFullList({
      filter: `chapterID="${id}"`,
    });
    return records;
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const record = await pb.collection("chapters").getOne(id);
    return record;
  } catch (error) {
    throw error;
  }
};

export const updateCard = async (id, data) => {
  try {
    const record = await pb.collection("carts").update(id, data);
    return record;
  } catch (error) {
    throw error;
  }
};

export const deleteCard = async (id) => {
  try {
    await pb.collection("carts").delete(id);
  } catch (error) {
    throw error;
  }
};

export const addCard = async (chapterId, card) => {
  try {
    const record = await pb.collection("carts").create({
      ...card,
      chapterID: chapterId,
    });
    return record;
  } catch (error) {
    throw error;
  }
};
