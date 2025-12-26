const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const morgan = require('morgan');

app.use(express.json());

app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log('hello from the middle ware');
  next();
});
app.use((req, res, next) => {
  req.requesteTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   //   res.status(200).send('hello from the server side');
//   res.status(200).json({
//     message: 'hello from the server',
//     app: 'natours',
//   });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this end point');
// });
//console.log(`${__dirname}`);
const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    'utf-8'
  )
); //x

const getAllTours = (req, res) => {
  console.log(req.requesteTime);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    requesteTime: req.requesteTime,
    data: {
      tours, //x
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    res.status(500).json({
      status: 'failed',
      message: 'invalid ID',
    });
  }

  const tour = tours.find((el) => el.id === id);
  //console.log(tour);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  //res.send('DONE');
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here>',
    },
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour);
app.use('/api/v1/tours', tourRouter);
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour);

const port = 3030;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
