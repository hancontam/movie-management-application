/**
 * Author: Nguyễn Ngọc Hân CE180049 - SE1816
 */
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("movies.db");

// Khởi tạo bảng
export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        status TEXT DEFAULT 'To Watch',
        poster_uri TEXT
      );
    `);
    console.log("✅ Database initialized");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Lấy tất cả phim - dùng cho HomeScreen
export const getAllMovies = () => {
  try {
    const allRows = db.getAllSync("SELECT * FROM movies ORDER BY id DESC");
    return allRows;
  } catch (error) {
    console.error("❌ Error getting all movies:", error);
    return [];
  }
};

// Lấy phim theo ID - dùng cho MovieDetailScreen
export const getMovieById = (id) => {
  try {
    const movie = db.getFirstSync("SELECT * FROM movies WHERE id = ?", [id]);
    return movie;
  } catch (error) {
    console.error("❌ Error getting movie by ID:", error);
    return null;
  }
};

// Thêm phim mới - Task 2
export const addMovie = (
  title,
  category,
  releaseYear,
  status = "To Watch",
  posterUri = null,
) => {
  try {
    const result = db.runSync(
      "INSERT INTO movies (title, category, release_year, status, poster_uri) VALUES (?, ?, ?, ?, ?)",
      [title, category, releaseYear, status, posterUri],
    );
    console.log("✅ Movie added with ID:", result.lastInsertRowId);
    return true;
  } catch (error) {
    console.error("❌ Error adding movie:", error);
    return false;
  }
};

// Cập nhật thông tin phim - Task 3 (Edit)
export const updateMovie = (
  id,
  title,
  category,
  releaseYear,
  status,
  posterUri,
) => {
  try {
    const result = db.runSync(
      "UPDATE movies SET title = ?, category = ?, release_year = ?, status = ?, poster_uri = ? WHERE id = ?",
      [title, category, releaseYear, status, posterUri, id],
    );
    console.log("✅ Movie updated, rows affected:", result.changes);
    return true;
  } catch (error) {
    console.error("❌ Error updating movie:", error);
    return false;
  }
};

// Cập nhật nhanh trạng thái - Task 3 (Change Status)
export const updateMovieStatus = (id, newStatus) => {
  try {
    const result = db.runSync("UPDATE movies SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);
    console.log("✅ Status updated, rows affected:", result.changes);
    return true;
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return false;
  }
};

// Xóa phim - Task 3 (Delete)
export const deleteMovie = (id) => {
  try {
    const result = db.runSync("DELETE FROM movies WHERE id = ?", [id]);
    console.log("✅ Movie deleted, rows affected:", result.changes);
    return true;
  } catch (error) {
    console.error("❌ Error deleting movie:", error);
    return false;
  }
};
// Tìm kiếm theo title hoặc category
export const searchMovies = (searchQuery) => {
  try {
    const query = `%${searchQuery}%`;
    const results = db.getAllSync(
      `SELECT * FROM movies 
       WHERE title LIKE ? OR category LIKE ? 
       ORDER BY release_year DESC`,
      [query, query],
    );
    return results;
  } catch (error) {
    console.error("❌ Error searching movies:", error);
    return [];
  }
};

// Lọc theo năm và/hoặc status
export const filterMovies = (year = null, status = null) => {
  try {
    let query = "SELECT * FROM movies WHERE 1=1";
    const params = [];

    if (year) {
      query += " AND release_year = ?";
      params.push(year);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    query += " ORDER BY release_year DESC";

    const results = db.getAllSync(query, params);
    return results;
  } catch (error) {
    console.error("❌ Error filtering movies:", error);
    return [];
  }
};
// Task 5: Thống kê số lượng phim theo thể loại
export const getMovieCountByCategory = () => {
  try {
    const results = db.getAllSync(`
      SELECT category, COUNT(*) AS total_movies
      FROM movies
      GROUP BY category
      ORDER BY total_movies DESC
    `);
    return results;
  } catch (error) {
    console.error("❌ Error getting movie count by category:", error);
    return [];
  }
};

// Task 6: Các năm có lượt thích bất thường (> avg + 30%)
export const getAbnormallyHighFavoriteYears = () => {
  try {
    const results = db.getAllSync(`
      SELECT release_year, COUNT(*) AS favorite_count 
      FROM movies 
      WHERE status = 'Favorite' 
      GROUP BY release_year 
      HAVING favorite_count > (
        SELECT AVG(count_per_year) * 1.3 
        FROM (
          SELECT COUNT(*) AS count_per_year 
          FROM movies 
          WHERE status = 'Favorite' 
          GROUP BY release_year
        )
      )
      ORDER BY favorite_count DESC
    `);
    return results;
  } catch (error) {
    console.error("❌ Error getting abnormally high favorite years:", error);
    return [];
  }
};

// Lấy phim theo status cụ thể (dùng cho thống kê)
export const getMoviesByStatus = (status) => {
  try {
    const results = db.getAllSync(
      "SELECT * FROM movies WHERE status = ? ORDER BY release_year DESC",
      [status],
    );
    return results;
  } catch (error) {
    console.error("❌ Error getting movies by status:", error);
    return [];
  }
};

// Task 9: Thống kê tổng quan cho Dashboard (Pie Chart)
export const getMovieStats = () => {
  try {
    const total =
      db.getFirstSync("SELECT COUNT(*) as count FROM movies")?.count || 0;
    const watched =
      db.getFirstSync("SELECT COUNT(*) as count FROM movies WHERE status = ?", [
        "Watched",
      ])?.count || 0;
    const toWatch =
      db.getFirstSync("SELECT COUNT(*) as count FROM movies WHERE status = ?", [
        "To Watch",
      ])?.count || 0;
    const favorite =
      db.getFirstSync("SELECT COUNT(*) as count FROM movies WHERE status = ?", [
        "Favorite",
      ])?.count || 0;

    return { total, watched, toWatch, favorite };
  } catch (error) {
    console.error("❌ Error getting movie stats:", error);
    return { total: 0, watched: 0, toWatch: 0, favorite: 0 };
  }
};
// Export tất cả phim ra JSON
export const exportMoviesData = () => {
  try {
    return getAllMovies();
  } catch (error) {
    console.error("❌ Error exporting movies data:", error);
    return [];
  }
};

// Import phim từ JSON (có xử lý trùng lặp)
export const importMoviesData = (moviesData, overwrite = false) => {
  let success = 0;
  let failed = 0;
  let skipped = 0;

  try {
    moviesData.forEach((movie) => {
      try {
        // Kiểm tra ID đã tồn tại chưa
        const existing = movie.id ? getMovieById(movie.id) : null;

        if (existing) {
          if (overwrite) {
            // Ghi đè
            const updated = updateMovie(
              movie.id,
              movie.title,
              movie.category,
              movie.release_year,
              movie.status,
              movie.poster_uri,
            );
            if (updated) success++;
            else failed++;
          } else {
            // Bỏ qua
            skipped++;
          }
        } else {
          // Thêm mới
          const added = addMovie(
            movie.title,
            movie.category,
            movie.release_year,
            movie.status,
            movie.poster_uri,
          );
          if (added) success++;
          else failed++;
        }
      } catch (err) {
        console.error("❌ Error importing movie:", err);
        failed++;
      }
    });

    return { success, failed, skipped };
  } catch (error) {
    console.error("❌ Error importing movies data:", error);
    return { success, failed, skipped };
  }
};

// Xóa tất cả phim (dùng cho testing)
export const deleteAllMovies = () => {
  try {
    db.runSync("DELETE FROM movies");
    console.log("✅ All movies deleted");
    return true;
  } catch (error) {
    console.error("❌ Error deleting all movies:", error);
    return false;
  }
};

// Khởi tạo ngay khi import file
initDatabase();
