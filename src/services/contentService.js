import API from "../utils/api";

export const getSiteContent = async () => {
  const response = await API.get("/content");
  return response.data?.data || {};
};

export const getSectionContent = async (sectionKey) => {
  if (!sectionKey) return {};
  const response = await API.get(`/content/${sectionKey}`);
  return response.data?.data || {};
};

export const updateSectionContent = async (sectionKey, payload) => {
  const response = await API.put(`/content/${sectionKey}`, payload);
  return response.data;
};

export const uploadContentMedia = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const formData = new FormData();
  formData.append("media", file);

  const response = await API.post("/content/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

