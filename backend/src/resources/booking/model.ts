import { sequelize } from "../../utils/dbConnect";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import User from "../user/model";
import Movie from "../movie/model";
import Seat from "../seat/model";

// Define the Booking model class with proper type inference
class BookingModel extends Model<InferAttributes<BookingModel>, InferCreationAttributes<BookingModel>> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare movieId: number;
    declare showTime: string;
    declare adultCount: number;
    declare childCount: number;
    declare totalPrice: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Association declarations
    declare Movie?: NonAttribute<typeof Movie>;
    declare User?: NonAttribute<typeof User>;
    declare seats?: NonAttribute<typeof Seat[]>;

    // Static method to set up associations
    static associate() {
        BookingModel.belongsTo(User, { foreignKey: 'userId' });
        BookingModel.belongsTo(Movie, { foreignKey: 'movieId' });
        BookingModel.hasMany(Seat, { foreignKey: 'bookingId', as: 'seats' });
    }
}

// Initialize the model
BookingModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Movie,
            key: 'id'
        }
    },
    showTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adultCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    childCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Bookings'
});

export default BookingModel; 