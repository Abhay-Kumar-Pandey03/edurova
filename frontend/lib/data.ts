import axios from "axios";

// ✅ Matches backend schema exactly
export interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placement_percent: number;
  courses: string[];
  description: string;
  image_url?: string;
  exam_accepted: string;
  min_rank: number;
  max_rank: number;
  created_at: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GetAllCollegesParams {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  exam?: string;
  page?: number;
}

export interface GetAllCollegesResponse {
  data: College[];
  pagination: Pagination;
}

// ✅ NEW: Stats interface
export interface Stats {
  totalColleges: number;
  totalStates: number;
  avgPlacement: number;
  topRating: number;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

export async function getAllColleges(params: GetAllCollegesParams = {}): Promise<GetAllCollegesResponse> {
  try {
    const response = await apiClient.get<GetAllCollegesResponse>("/api/colleges", { params });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch colleges."));
  }
}

export async function getCollegeById(id: string): Promise<College> {
  try {
    const response = await apiClient.get<College>(`/api/colleges/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, `Failed to fetch college with ID: ${id}.`));
  }
}

export async function compareColleges(ids: string[]): Promise<College[]> {
  try {
    const response = await apiClient.get<College[]>("/api/compare", {
      params: { ids: ids.join(",") },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to compare colleges."));
  }
}

export async function predictColleges(exam: string, rank: number): Promise<College[]> {
  try {
    const response = await apiClient.get<College[]>("/api/predict", {
      params: { exam: exam.toUpperCase(), rank },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to predict colleges."));
  }
}

// ✅ NEW: Fetch real stats from backend
export async function getStats(): Promise<Stats> {
  try {
    const response = await apiClient.get<Stats>("/api/colleges/stats");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch stats."));
  }
}
