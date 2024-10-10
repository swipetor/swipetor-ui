import UIConfig from 'src/types/UIConfig';

const uiConfig = (window as any)?.uiConfig as UIConfig;
uiConfig.site.email = atob(uiConfig.site.email);

export default uiConfig;
