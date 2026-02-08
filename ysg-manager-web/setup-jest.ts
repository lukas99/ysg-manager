// see https://github.com/thymikee/jest-preset-angular/tree/main/examples/example-app-v20

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import './jest-global-mocks';

setupZoneTestEnv();
