var windowWidth, windowHeight;
if (self.innerHeight) {
    // all except Explorer        
    windowWidth = self.innerWidth;
    windowHeight = self.innerHeight;
} else if (document.documentElement && document.documentElement.clientHeight) {
    // Explorer 6 Strict Mode        
    windowWidth = document.documentElement.clientWidth;
    windowHeight = document.documentElement.clientHeight;
} else if (document.body) {
    // other Explorers       
    windowWidth = document.body.clientWidth;
    windowHeight = document.body.clientHeight;
}
