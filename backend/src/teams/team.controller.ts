import { Request, Response, NextFunction } from 'express';
import { teamService } from './team.service';
import { AppError } from '../middleware/errorHandler';

export class TeamController {
    private static instance: TeamController;

    private constructor() { }

    public static getInstance(): TeamController {
        if (!TeamController.instance) {
            TeamController.instance = new TeamController();
        }
        return TeamController.instance;
    }

    public getAllTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teams = await teamService.findAll();
            res.status(200).json({
                success: true,
                data: { teams }
            });
        } catch (err) {
            next(err);
        }
    };

    public createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const team = await teamService.createTeam(req.body);
            res.status(201).json({
                success: true,
                data: { team }
            });
        } catch (err) {
            next(err);
        }
    };
}

export const teamController = TeamController.getInstance();
