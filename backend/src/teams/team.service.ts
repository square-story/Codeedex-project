import { Team, ITeam } from '../models/Team';

export class TeamService {
    private static instance: TeamService;

    private constructor() { }

    public static getInstance(): TeamService {
        if (!TeamService.instance) {
            TeamService.instance = new TeamService();
        }
        return TeamService.instance;
    }

    public async findAll(): Promise<ITeam[]> {
        return Team.find().sort({ name: 1 });
    }

    public async createTeam(data: Partial<ITeam>): Promise<ITeam> {
        return Team.create(data);
    }

    public async findById(id: string): Promise<ITeam | null> {
        return Team.findById(id);
    }
}

export const teamService = TeamService.getInstance();
