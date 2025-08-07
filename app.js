const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const flash = require('express-flash');

const app = express();
app.use(session({
    secret: '1975bee3274df4f786c4c60fe54fcfa3', // Change this to a secret key
    resave: true,
    saveUninitialized: true
}));
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Koneksi ke database hanya dilakukan satu kali di awal
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_bioskop" // Ganti dengan nama database Anda
});

db.connect(function(err) {
    if (err) throw err;
});

app.get('/', (req, res) => {
  let message = false;
  res.render('login', { message });
});

app.get('/login', (req, res) => {
  let message = false;
  res.render('login', { message });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM tb_user WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length > 0) {
      req.session.idUser = results[0].id;
      const role = results[0].role;
      if (role === 'admin') {
        res.redirect('/dashboard');
      } else if(role==='user') {
        res.redirect('/home');
      }
    } else {
      res.render('login', { message: true });
    }
  });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { email, password, nama, role } = req.body;
    const insertUserQuery = "INSERT INTO tb_user (email, password, name, role) VALUES (?, ?, ?, ?)";

    db.query(insertUserQuery, [email, password, nama, role], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Gagal register");
        }
        res.redirect('/');
    });
});

app.get('/dashboard', (req, res) => {
     const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', {message: null});
    }
    res.render('dashboard');
});

// Tampilkan semua movie
app.get('/movies', (req, res) => {
    const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', { message: null });
    }

    const movieQuery = 'SELECT * FROM tb_movie';
    db.query(movieQuery, (err, moviesData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const ket = req.session.ket || null;
        delete req.session.ket;

        res.render('movies', { idUser, data: moviesData, ket });
    });
});

// Form input movie
app.get('/input-movies', (req, res) => {
    const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', { message: null });
    }
    const userId = req.session.userId;
    res.render('input-movies', { userId });
});

// Proses simpan movie
app.post('/input-movies', (req, res) => {
    const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', { message: null });
    }

    const { title, deskripsi, duration_minutes } = req.body;
    const query = 'INSERT INTO tb_movie (title, description, duration_minutes) VALUES (?, ?, ?)';

    db.query(query, [title, deskripsi, duration_minutes], (err) => {
         if (err) {
            console.error(err);
            req.session.ket = 'Gagal simpan data';
        } else {
            req.session.ket = 'Berhasil simpan data';
        }
     
        res.redirect('/movies');
    });
});

// Hapus movie
app.get('/hapus-movies/:id', (req, res) => {
    const idMovies = req.params.id;
    const query = 'DELETE FROM tb_movie WHERE id = ?';

    db.query(query, [idMovies], (err) => {
        if (err) {
            console.error(err);
            req.session.ket = 'Gagal hapus data';
        } else {
            req.session.ket = 'Berhasil hapus data';
        }
        res.redirect('/movies');
    });
});

// Form edit movie
app.get('/edit-movies/:id', (req, res) => {
    const id = req.params.id;
    const idUser = req.session.idUser;

    if (!idUser) {
        return res.render('login', { message: null });
    }

    const userId = req.session.userId;
    const query = 'SELECT * FROM tb_movie WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('edit-movies', { userId, data: results[0] });
    });
});

// Proses edit movie
app.post('/edit-movies/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, duration_minutes } = req.body;
    const idUser = req.session.idUser;

    if (!idUser) {
        return res.render('login', { message: null });
    }

    const query = 'UPDATE tb_movie SET title = ?, description = ?, duration_minutes = ? WHERE id = ?';
    db.query(query, [title, description, duration_minutes, id], (err) => {
        if (err) {
            console.error(err);
            req.session.ket = 'Gagal perbarui data';
        } else {
            req.session.ket = 'Berhasil perbarui data';
        }

        res.redirect('/movies');
    });
});



// Tampilkan semua studio
app.get('/studios', (req, res) => {
    const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', { message: null });
    }

    const studioQuery = 'SELECT * FROM tb_studio';
    db.query(studioQuery, (err, studiosData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const ket = req.session.ket || null;
        delete req.session.ket;

        res.render('studios', { idUser, data: studiosData, ket });
    });
});

// Form input studio
app.get('/input-studios', (req, res) => {
    const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', { message: null });
    }
    const userId = req.session.userId;
    res.render('input-studios', { userId });
});

// Proses simpan studio
app.post('/input-studios', (req, res) => {
    const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', { message: null });
    }

    const { studio_number, seat_capacity } = req.body;
    const query = 'INSERT INTO tb_studio (studio_number, seat_capacity) VALUES (?, ?)';

    db.query(query, [studio_number, seat_capacity], (err) => {
         if (err) {
            console.error(err);
            req.session.ket = 'Gagal simpan data';
        } else {
            req.session.ket = 'Berhasil simpan data';
        }
        res.redirect('/studios');
    });
});

// Hapus studio
app.get('/hapus-studios/:id', (req, res) => {
    const idstudios = req.params.id;
    const query = 'DELETE FROM tb_studio WHERE id = ?';

    db.query(query, [idstudios], (err) => {
        if (err) {
            console.error(err);
            req.session.ket = 'Gagal hapus data';
        } else {
            req.session.ket = 'Berhasil hapus data';
        }
        res.redirect('/studios');
    });
});

// Form edit studio
app.get('/edit-studios/:id', (req, res) => {
    const id = req.params.id;
    const idUser = req.session.idUser;

    if (!idUser) {
        return res.render('login', { message: null });
    }

    const userId = req.session.userId;
    const query = 'SELECT * FROM tb_studio WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('edit-studios', { userId, data: results[0] });
    });
});

// Proses edit studio
app.post('/edit-studios/:id', (req, res) => {
    const id = req.params.id;
    const { studio_number, seat_capacity } = req.body;
    const idUser = req.session.idUser;

    if (!idUser) {
        return res.render('login', { message: null });
    }

    const query = 'UPDATE tb_studio SET studio_number = ?, seat_capacity = ? WHERE id = ?';
    db.query(query, [studio_number, seat_capacity, id], (err) => {
         if (err) {
            console.error(err);
            req.session.ket = 'Gagal perbarui data';
        } else {
            req.session.ket = 'Berhasil perbarui data';
        }
        res.redirect('/studios');
    });
});


// SHOWTIME - LIST
app.get('/showtimes', (req, res) => {
  const idUser = req.session.idUser;
  if (!idUser) return res.render('login', {message: null});;

  const query = `
    SELECT 
      tb_showtime.id, 
      tb_showtime.start_time, 
      tb_movie.title AS movieName, 
      tb_studio.studio_number AS studioNo 
    FROM tb_showtime
    INNER JOIN tb_movie ON tb_showtime.movie_id = tb_movie.id
    INNER JOIN tb_studio ON tb_showtime.studio_id = tb_studio.id
  `;

  db.query(query, (err, data) => {
    if (err) return res.status(500).send('Internal Server Error');
    const ket = req.session.ket || null;
    delete req.session.ket;
    res.render('showtimes', { userId: req.session.userId, data, ket });
  });
});

// INPUT SHOWTIME - FORM
app.get('/input-showtimes', (req, res) => {
  const idUser = req.session.idUser;
  if (!idUser) return res.render('login', {message: null});;

  db.query('SELECT * FROM tb_movie', (err, movieData) => {
    if (err) return res.status(500).send('Internal Server Error');

    db.query('SELECT * FROM tb_studio', (err, studioData) => {
      if (err) return res.status(500).send('Internal Server Error');

      res.render('input-showtimes', {
        userId: req.session.userId,
        dataMovies: movieData,
        dataStudio: studioData,
      });
    });
  });
});

// INPUT SHOWTIME - POST
app.post('/input-showtimes', (req, res) => {
  const idUser = req.session.idUser;
  if (!idUser) return res.render('login', {message: null});;

  const { movie, studio, start_time } = req.body;
  const query = 'INSERT INTO tb_showtime (movie_id, studio_id, start_time) VALUES (?, ?, ?)';

  db.query(query, [movie, studio, start_time], (err) => {
     if (err) {
            console.error(err);
            req.session.ket = 'Gagal simpan data';
        } else {
            req.session.ket = 'Berhasil simpan data';
        }
    res.redirect('/showtimes');
  });
});

// HAPUS SHOWTIME
app.get('/hapus-showtimes/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM tb_showtime WHERE id = ?';

  db.query(query, [id], (err) => {
     if (err) {
            console.error(err);
            req.session.ket = 'Gagal hapus data';
        } else {
            req.session.ket = 'Berhasil hapus data';
        }
    res.redirect('/showtimes');
  });
});

// EDIT SHOWTIME - FORM
app.get('/edit-showtimes/:id', (req, res) => {
  const idUser = req.session.idUser;
  if (!idUser) return res.render('login', {message: null});

  const id = req.params.id;
  const query = `
    SELECT 
      tb_showtime.id, 
      tb_showtime.start_time, 
      tb_showtime.movie_id AS movieId, 
      tb_showtime.studio_id AS studioId 
    FROM tb_showtime 
    WHERE tb_showtime.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send('Internal Server Error');

    db.query('SELECT * FROM tb_movie', (err, movieData) => {
      if (err) return res.status(500).send('Internal Server Error');

      db.query('SELECT * FROM tb_studio', (err, studioData) => {
        if (err) return res.status(500).send('Internal Server Error');

        res.render('edit-showtimes', {
          userId: req.session.userId,
          data: result[0],
          dataMovies: movieData,
          dataStudio: studioData,
        });
      });
    });
  });
});

// EDIT SHOWTIME - POST
app.post('/edit-showtimes/:id', (req, res) => {
  const idUser = req.session.idUser;
  if (!idUser) return res.render('login', {message: null});;

  const id = req.params.id;
  const { movie, studio, start_time } = req.body;

  const query = 'UPDATE tb_showtime SET movie_id = ?, studio_id = ?, start_time = ? WHERE id = ?';
  db.query(query, [movie, studio, start_time, id], (err) => {
     if (err) {
            console.error(err);
            req.session.ket = 'Gagal perbaharui data';
        } else {
            req.session.ket = 'Berhasil perbaharui data';
        }
    res.redirect('/showtimes');
  });
});

app.get('/home', (req, res) => {

     const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', {message: null});
    }
    const movieQuery = 'SELECT * FROM tb_movie';
    db.query(movieQuery, (err, moviesData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

            res.render('home', {idUser, data: moviesData });
        });
});

app.get('/movies/:id/showtimes', (req, res) => {
   const idMovies = req.params.id;
   
     const idUser = req.session.idUser;
    if (!idUser) {
        return res.render('login', {message: null});
    }
  const movieQuery = 'SELECT tb_showtime.id AS idShowtime, tb_showtime.start_time, tb_showtime.movie_id AS movieId, tb_showtime.studio_id AS studioId,tb_movie.id AS idMovie,tb_studio.id AS idStudi, tb_movie.title AS movieName,tb_movie.duration_minutes AS waktuFilm, tb_studio.studio_number AS studioNo FROM tb_showtime INNER JOIN tb_movie ON tb_showtime.movie_id = tb_movie.id INNER JOIN tb_studio ON tb_showtime.studio_id = tb_studio.id WHERE tb_movie.id = ?;';
   db.query(movieQuery, [idMovies], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
       res.render('detail-movies', {idUser, movieData: results});
           
    });
           
        
});

app.get('/showtimes/:id/seats', (req, res) => {
  const idShowtime = req.params.id;
  const idUser = req.session.idUser;

  if (!idUser) {
    return res.render('login', { message: null });
  }

  const showtimeQuery = 'SELECT * FROM tb_showtime WHERE id = ?';
  db.query(showtimeQuery, [idShowtime], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('Showtime not found');
    }

    const studioId = results[0].studio_id;

    const studioQuery = 'SELECT * FROM tb_studio WHERE id = ?';
    db.query(studioQuery, [studioId], (err, resultsStudio) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      const total_seats = resultsStudio[0].seat_capacity;
      const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const seatsPerRow = 10;
      const totalRows = Math.ceil(total_seats / seatsPerRow);

      let seatCount = 0;
      const arrSeats = [];

      for (let r = 0; r < totalRows; r++) {
        const rowLetter = rows[r];
        for (let n = 1; n <= seatsPerRow; n++) {
          if (seatCount < total_seats) {
            arrSeats.push(`${rowLetter}${n}`);
            seatCount++;
          } else {
            break;
          }
        }
      }

      // Query kursi yang sudah dibooking
      const bookedSeatQuery = `
        SELECT bs.seat_number
        FROM tb_booking_seat bs
        JOIN tb_booking b ON bs.booking_id = b.id
        WHERE b.showtime_id = ?
      `;

      db.query(bookedSeatQuery, [idShowtime], (err, bookedResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error getting booked seats');
        }

        const bookedSeats = bookedResults.map(s => s.seat_number);

        res.render('detail-showtimes', {
          idUser,
          showtimeData: results,
          arrSeats,
          total_seats,
          resultsStudio,
          data: resultsStudio[0],
          bookedSeats
        });
      });
    });
  });
});

app.post('/bookings', (req, res) => {
  const { showtime_id, user_id } = req.body;
  let seat_numbers = req.body.seat_number;

  // Pastikan seat_numbers adalah array
  if (!Array.isArray(seat_numbers)) {
    seat_numbers = [seat_numbers];
  }

  if (seat_numbers.length === 0) {
    return res.send('Pilih setidaknya satu kursi!');
  }

  // Cek apakah ada kursi yang sudah dibooking
  const placeholders = seat_numbers.map(() => '?').join(', ');
  const checkQuery = `
    SELECT seat_number FROM tb_booking_seat 
    WHERE seat_number IN (${placeholders}) 
    AND booking_id IN (
      SELECT id FROM tb_booking WHERE showtime_id = ?
    )
  `;

  db.query(checkQuery, [...seat_numbers, showtime_id], (err, existing) => {
    if (err) {
      console.error('Error cek kursi:', err);
      return res.status(500).send('Database error saat cek kursi');
    }

    if (existing.length > 0) {
      const bookedSeats = existing.map(row => row.seat_number).join(', ');
      return res.send(`Kursi sudah dibooking: ${bookedSeats}`);
    }

    // Insert booking
    const insertBooking = `INSERT INTO tb_booking (showtime_id, user_id) VALUES (?, ?)`;
    db.query(insertBooking, [showtime_id, user_id], (err, result) => {
      if (err) {
        console.error('Error insert booking:', err);
        return res.status(500).send('Gagal simpan booking');
      }

      const booking_id = result.insertId;

      // Simpan semua kursi terpilih
      const insertSeat = `INSERT INTO tb_booking_seat (booking_id, seat_number) VALUES ?`;
      const seatValues = seat_numbers.map(seat => [booking_id, seat]);

      db.query(insertSeat, [seatValues], (err) => {
        if (err) {
          console.error('Error insert seat:', err);
          return res.status(500).send('Gagal simpan kursi');
        }

        res.redirect(`/showtimes/${showtime_id}/seats`);
      });
    });
  });
});


app.listen(1000, () => {
    console.log("Koneksi");
});