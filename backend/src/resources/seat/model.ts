import { sequelize } from "../../utils/dbConnect";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import Booking from "../booking/model";
import Movie from "../movie/model";

// Define the Seat model class with proper type inference
class SeatModel extends Model<InferAttributes<SeatModel>, InferCreationAttributes<SeatModel>> {
    declare id: CreationOptional<number>;
    declare bookingId: number;
    declare movieId: number;
    declare seatRow: number;
    declare seatColumn: number;
    declare isOccupied: boolean;
    declare showTime: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Static method to set up associations
    static associate() {
        SeatModel.belongsTo(Booking, { foreignKey: 'bookingId' });
        SeatModel.belongsTo(Movie, { foreignKey: 'movieId' });
    }
}

// Initialize the model
SeatModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Booking,
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
    seatRow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    seatColumn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 20
        }
    },
    isOccupied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    showTime: {
        type: DataTypes.STRING,
        allowNull: false
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
    modelName: 'Seats',
    indexes: [
        {
            unique: true,
            fields: ['movieId', 'showTime', 'seatRow', 'seatColumn']
        }
    ]
});

export default SeatModel; 