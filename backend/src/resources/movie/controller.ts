import { Request, Response } from 'express';
import Movie from './model';
import { where } from 'sequelize';

export const createMovie = async (req: Request, res: Response) => {
    try {
        let reqMovie = req.body;
        reqMovie.releaseDate = reqMovie.releaseDate !== '' ? reqMovie.releaseDate : new Date('1970-01-01');
        const movie = await Movie.create(reqMovie);
        
        return res.status(201).json({
            message: 'Movie created successfully',
            movie
        });
    } catch (e) {
        console.error('Create movie error:', e);
        return res.status(500).json({ message: 'Error creating movie' });
    }
};

export const getMovies = async (req: Request, res: Response) => {
    try {
        const movies = await Movie.findAll({
            order: [['releaseDate', 'DESC']]
        });
        return res.json(movies);
    } catch (e) {
        console.error('Get movies error:', e);
        return res.status(500).json({ message: 'Error fetching movies' });
    }
};

export const getTopMovies = async (req: Request, res:Response) => {
    try {
        const topMovies = await Movie.findAll({
            order: [['rating', 'DESC']]
        })
        return res.json(topMovies)
    } catch (e) {
        console.error('Get movies error:', e);
        return res.status(500).json({ message: 'Error fetching movies' });
    }
}

export const getCommingSoonMovies = async (req: Request, res:Response) => {
    try {
        const topMovies = await Movie.findAll({where:{
            releaseDate: new Date('1970-01-01')
        }})
        return res.json(topMovies)
    } catch (e) {
        console.error('Get movies error:', e);
        return res.status(500).json({ message: 'Error fetching movies' });
    }
}
export const updateMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Movie.update(req.body, {
            where: { id }
        });
        if (updated) {
            const updatedMovie = await Movie.findByPk(id);
            return res.json({
                message: 'Movie updated successfully',
                movie: updatedMovie
            });
        }
        return res.status(404).json({ message: 'Movie not found' });
    } catch (e) {
        console.error('Update movie error:', e);
        return res.status(500).json({ message: 'Error updating movie' });
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Movie.destroy({
            where: { id }
        });
        if (deleted) {
            return res.json({ message: 'Movie deleted successfully' });
        }
        return res.status(404).json({ message: 'Movie not found' });
    } catch (e) {
        console.error('Delete movie error:', e);
        return res.status(500).json({ message: 'Error deleting movie' });
    }
}; 