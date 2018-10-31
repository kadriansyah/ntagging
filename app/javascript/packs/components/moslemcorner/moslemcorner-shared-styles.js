const styleElement = document.createElement('dom-module');
styleElement.innerHTML = `
    <template>
        <style>
            :root {
                --primary-color: #4285f4;
            }
            [hidden] {
                display: none !important;
            }
            input {
                position: relative;
                outline: none;
                box-shadow: none;
                margin: 0;
                padding: 0;
                width: 100%;
                max-width: 100%;
                background: transparent;
                border: none;
                color: var(--paper-input-container-input-color, var(--primary-text-color));
                -webkit-appearance: none;
                text-align: inherit;
                vertical-align: bottom;
                min-width: 0;
                font-family: var(--paper-font-subhead_-_font-family);
                -webkit-font-smoothing: var(--paper-font-subhead_-_-webkit-font-smoothing);
                font-size: var(--paper-font-subhead_-_font-size);
                font-weight: var(--paper-font-subhead_-_font-weight);
                line-height: var(--paper-font-subhead_-_line-height);
            }
            textarea {
                position: relative;
                outline: none;
                box-shadow: none;
                margin: 0;
                padding: 0;
                width: 100%;
                max-width: 100%;
                background: transparent;
                border: none;
                resize: none;
                color: var(--paper-input-container-input-color, var(--primary-text-color));
                -webkit-appearance: none;
                text-align: inherit;
                vertical-align: bottom;
                min-width: 0;
                font-family: var(--paper-font-subhead_-_font-family);
                -webkit-font-smoothing: var(--paper-font-subhead_-_-webkit-font-smoothing);
                font-size: var(--paper-font-subhead_-_font-size);
                font-weight: var(--paper-font-subhead_-_font-weight);
                line-height: var(--paper-font-subhead_-_line-height);
            }
            .card {
                margin: var(--card-margin, 24px);
                padding: 20px;
                color: #757575;
                border-radius: 5px;
                background-color: #fff;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }
            .alert-error {
                background: #ffcdd2;
                border: 1px solid #f44336;
                border-radius: 3px;
                color: #333;
                font-size: 14px;
                padding: 10px;
            }
            .bg_mark_orange {
                background: orange;
                color: white;
                padding: 3px 3px;
            }
            .bg_mark_blue {
                background: blue;
                color: white;
                padding: 3px 3px;
            }
            .bg_mark_red {
                background: red;
                color: white;
                padding: 3px 3px;
            }
            .bg_mark_black {
                background: black;
                color: white;
                padding: 3px 3px;
            }
            .bg_mark_green {
                background: green;
                color: white;
                padding: 3px 3px;
            }
        </style>
    </template>
`;
styleElement.register('shared-styles'); 
