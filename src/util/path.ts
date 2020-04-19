import * as path from "path";
import * as process from 'process';

export default path.dirname(process.mainModule?.filename ?? "");