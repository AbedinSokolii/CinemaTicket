import BookingModel from '../resources/booking/model';
import SeatModel from '../resources/seat/model';
import User from '../resources/user/model';
import Movie from '../resources/movie/model';

export const initializeAssociations = () => {
    // Initialize all model associations
    User.associate();
    BookingModel.associate();
    SeatModel.associate();
    
    // Set up associations for Movie
    Movie.hasMany(BookingModel, { foreignKey: 'movieId' });
    Movie.hasMany(SeatModel, { foreignKey: 'movieId' });
}; 