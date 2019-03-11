import { createGlobalStyle } from 'styled-components';

import { spacingsm } from 'styles/sizing';

export default createGlobalStyle`
    .row {
        display:block;

        > * {
            margin: ${spacingsm};
        }

        .row, .row > * {
            margin: 0;
        }
    }

    .column {
        display: flex;
        height: 100%;
        flex-direction: column;
    }

    .hidden {
        display: none;
    }
`;