/**
 * automated-test.js
 * Automated End-to-End API Test Script for CineVault
 * Tests all 5 CRUD operations against the live Express + MongoDB backend
 * Zero third-party testing framework dependencies required.
 */

const http = require('http');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';
const parsedUrl = new URL(BASE_URL);
const HOST = parsedUrl.hostname;
const PORT = parsedUrl.port || 5000;

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: HOST,
        port: PORT,
        path: options.path,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
          ...options.headers,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {
            parsed = body;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🎬 Running CineVault Automated API Tests');
  console.log(`Target: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;
  let testMovieId = null;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. GET Root /
    console.log('Test 1: GET / (Frontend / Status)');
    const rootRes = await request({ path: '/', method: 'GET' });
    assert(rootRes.status === 200, 'Frontend served with HTTP 200');

    // 2. POST /api/movies - Create Movie
    console.log('\nTest 2: POST /api/movies (Create Movie)');
    const newMovie = {
      title: 'Automated Test Movie',
      genre: 'Testing',
      releaseYear: 2026,
      director: 'QA Engineer',
      rating: 9.5,
    };
    const createRes = await request(
      { path: '/api/movies', method: 'POST' },
      JSON.stringify(newMovie)
    );
    assert(createRes.status === 201, 'POST /api/movies returns HTTP 201 Created');
    assert(createRes.data && createRes.data.success === true, 'Response body has success: true');
    assert(createRes.data?.data?.title === newMovie.title, 'Movie title matches submitted data');
    testMovieId = createRes.data?.data?._id;
    assert(Boolean(testMovieId), `Generated valid MongoDB ID: ${testMovieId}`);

    // 3. GET /api/movies - Get All Movies
    console.log('\nTest 3: GET /api/movies (Get All Movies)');
    const getAllRes = await request({ path: '/api/movies', method: 'GET' });
    assert(getAllRes.status === 200, 'GET /api/movies returns HTTP 200 OK');
    assert(Array.isArray(getAllRes.data?.data), 'Data field is an array of movies');
    const foundMovie = getAllRes.data?.data?.some((m) => m._id === testMovieId);
    assert(foundMovie, 'Created movie is found in the returned collection');

    // 4. GET /api/movies/:id - Get Single Movie
    console.log(`\nTest 4: GET /api/movies/${testMovieId} (Get Single Movie)`);
    const getSingleRes = await request({ path: `/api/movies/${testMovieId}`, method: 'GET' });
    assert(getSingleRes.status === 200, 'GET /api/movies/:id returns HTTP 200 OK');
    assert(getSingleRes.data?.data?._id === testMovieId, 'Returned movie ID matches requested ID');

    // 5. PUT /api/movies/:id - Update Movie
    console.log(`\nTest 5: PUT /api/movies/${testMovieId} (Update Movie)`);
    const updateData = {
      title: 'Automated Test Movie (Updated)',
      genre: 'Sci-Fi Testing',
      releaseYear: 2027,
      director: 'QA Engineer Senior',
      rating: 9.9,
    };
    const updateRes = await request(
      { path: `/api/movies/${testMovieId}`, method: 'PUT' },
      JSON.stringify(updateData)
    );
    assert(updateRes.status === 200, 'PUT /api/movies/:id returns HTTP 200 OK');
    assert(updateRes.data?.data?.title === updateData.title, 'Movie title updated successfully');
    assert(updateRes.data?.data?.rating === updateData.rating, 'Movie rating updated successfully');

    // 6. DELETE /api/movies/:id - Clean up / Delete Movie
    console.log(`\nTest 6: DELETE /api/movies/${testMovieId} (Delete Movie)`);
    const deleteRes = await request({ path: `/api/movies/${testMovieId}`, method: 'DELETE' });
    assert(deleteRes.status === 200, 'DELETE /api/movies/:id returns HTTP 200 OK');
    assert(deleteRes.data?.success === true, 'Response indicates successful deletion');

    // 7. Verify Deletion
    console.log(`\nTest 7: Verify Deletion with GET /api/movies/${testMovieId}`);
    const verifyRes = await request({ path: `/api/movies/${testMovieId}`, method: 'GET' });
    assert(verifyRes.status === 404, 'Deleted movie now returns HTTP 404 Not Found');

    console.log('\n====================================================');
    console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Test execution failed with error:', error.message);
    process.exit(1);
  }
}

runTests();

