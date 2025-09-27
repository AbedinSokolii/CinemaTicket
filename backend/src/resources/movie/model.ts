import { sequelize } from "../../utils/dbConnect";
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";

export interface MovieModel extends Model<InferAttributes<MovieModel>, InferCreationAttributes<MovieModel>> {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    price: string;
    duration: string;
    rating: number;
    showTimes: string[];
    releaseDate: Date | null;
}

const Movie = sequelize.define<MovieModel>('Movies', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageSrc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageAlt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    showTimes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    releaseDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

export default Movie; 