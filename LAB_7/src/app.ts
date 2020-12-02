import * as express from 'express';
import { Request, Response } from 'express';
import { Movies } from './routes/moviesroute';

class App {
    public app: express.Application;
    public moviesroute: Movies = new Movies();
    public pathsAccessed: Object = {};
    public visits: number = 0;

    constructor() {
        this.app = express();
        this.config();
        this.moviesroute.routes(this.app);
    }

    private LoggerOne = (req: Request, res: Response, next: Function) => {
        this.visits++
        console.log("No. of Visits: " + this.visits)
        next()
    }

    private LoggerTwo = (req: Request, res: Response, next: Function) => {
        console.log('Request body:', req.body);
        console.log('Request url:', req.originalUrl);
        console.log("Http verb:", req.method);
        next()
    }

    private LoggerThird = (req: Request, res: Response, next: Function) => {
        if (!this.pathsAccessed[req.path]) this.pathsAccessed[req.path] = 0;
        this.pathsAccessed[req.path]++;
        console.log('There have now been ' + this.pathsAccessed[req.path] + ' requests made to ' + req.path);
        next();
    }


    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.LoggerThird);
        this.app.use(this.LoggerTwo);
        this.app.use(this.LoggerOne);

    }


}

export default new App().app;