
const many_words = ["aboard", "abroad", "absent", "absorb", "absurd", "accent", "accept", "access", "accord", "across", "acting", "action", "active", "actual", "adhere", "adjust", "admire", "advent", "advice", "advise", "aerial", "affair", "affect", "afford", "afraid", "agency", "agenda", "albeit", "allied", "almost", "always", "amount", "anchor", "animal", "annual", "answer", "anyone", "anyway", "appeal", "appear", "arctic", "around", "arrest", "arrive", "artery", "artist", "asleep", "aspect", "assert", "assess", "assign", "assist", "assume", "assure", "asthma", "atomic", "attach", "attack", "attain", "attend", "august", "author", "autumn", "avenue", "backed", "backup", "bailey", "ballet", "ballot", "banana", "banker", "banner", "barely", "Barney", "barred", "barrel", "basket", "battle", "beaten", "beauty", "became", "become", "before", "behalf", "behave", "behind", "belief", "belong", "benign", "berlin", "beside", "better", "beyond", "biased", "binary", "bishop", "bitter", "blamed", "bloody", "bodily", "boiler", "border", "boring", "borrow", "bother", "bottle", "bottom", "bought", "bounce", "boxing", "branch", "breach", "breast", "breath", "breeze", "bridge", "bright", "broken", "broker", "bronze", "browse", "brutal", "bubble", "bucket", "budget", "buffer", "buffet", "bullet", "bundle", "burden", "bureau", "burial", "burton", "butler", "butter", "button", "byline", "bypass", "caller", "camera", "campus", "cancel", "cancer", "candle", "cannon", "cannot", "canvas", "canyon", "carbon", "career", "caring", "carpet", "casino", "castle", "casual", "cattle", "caught", "causal", "cement", "census", "center", "centre", "chance", "change", "chapel", "charge", "cheese", "cherry", "choice", "choose", "chorus", "chosen", "church", "cinema", "circle", "circus", "clause", "clergy", "clever", "client", "clinic", "closed", "closer", "coffee", "coffin", "collar", "colony", "colour", "column", "combat", "comedy", "coming", "commit", "common", "comply", "convey", "cooler", "cooper", "coping", "copper", "corner", "corpus", "costly", "cotton", "county", "couple", "coupon", "course", "cousin", "covers", "create", "credit", "crisis", "critic", "cruise", "crying", "custom", "damage", "danger", "daring", "deadly", "dealer", "debate", "debris", "debtor", "decade", "decent", "decide", "decree", "defeat", "defect", "defend", "define", "degree", "demand", "demise", "denial", "dental", "depend", "deploy", "deputy", "derive", "desert", "design", "desire", "detail", "detect", "device", "devise", "devote", "diesel", "differ", "digest", "dinner", "direct", "divide", "divine", "doctor", "dollar", "domain", "donate", "double", "dragon", "drawer", "driven", "driver", "during", "easily", "eating", "editor", "effect", "effort", "eighth", "eighty", "either", "eleven", "emerge", "empire", "employ", "enable", "ending", "endure", "energy", "engage", "engine", "enough", "enroll", "ensure", "entire", "entity", "enzyme", "equity", "escape", "estate", "esteem", "ethnic", "evolve", "exceed", "except", "excess", "excise", "excuse", "exempt", "exodus", "exotic", "expand", "expect", "expert", "expire", "export", "expose", "extend", "extent", "fabric", "facial", "facing", "factor", "failed", "fairly", "fallen", "family", "famous", "farmer", "father", "favour", "fellow", "female", "fierce", "figure", "filing", "filter", "finale", "finely", "finger", "finish", "finite", "firing", "fiscal", "fisher", "flavor", "flight", "floppy", "flower", "flying", "follow", "forced", "forest", "forget", "forgot", "formal", "format", "former", "fossil", "foster", "fought", "fourth", "freeze", "french", "friend", "fringe", "frozen", "fuller", "fusion", "future", "galaxy", "gallon", "gamble", "gaming", "garage", "garden", "garlic", "gather", "gender", "genius", "gentle", "german", "gifted", "ginger", "glance", "global", "golden", "google", "gospel", "gossip", "gotten", "govern", "grader", "gravel", "ground", "growth", "guilty", "guinea", "guitar", "hammer", "handed", "handle", "happen", "harbor", "hardly", "hassle", "hatred", "hazard", "headed", "health", "heated", "heaven", "height", "helmet", "herald", "hereby", "herein", "heroic", "hidden", "hockey", "holder", "hollow", "honest", "honour", "hooked", "horror", "humble", "hunger", "hungry", "hunter", "hurdle", "hybrid", "ignore", "immune", "impact", "import", "impose", "income", "indeed", "indoor", "induce", "infant", "inform", "injury", "inland", "insect", "insert", "inside", "insist", "insure", "intact", "intake", "intend", "intent", "invest", "invite", "ironic", "island", "itself", "jacket", "jersey", "jockey", "johnny", "joseph", "jungle", "junior", "keeper", "kidney", "killed", "killer", "kindly", "knight", "labour", "ladder", "landed", "lately", "latest", "latter", "launch", "lawyer", "layout", "leader", "league", "leaves", "legacy", "legend", "length", "lesser", "lesson", "lethal", "letter", "liable", "lights", "likely", "linear", "lining", "linked", "liquid", "listen", "little", "lively", "living", "loaded", "locate", "lonely", "losing", "lounge", "lovely", "loving", "lucent", "luxury", "Maggie", "mainly", "making", "manage", "manner", "manual", "marble", "margin", "marina", "marine", "marked", "marker", "market", "martin", "master", "matrix", "matter", "mature", "median", "medium", "member", "memory", "mental", "mentor", "merely", "merger", "method", "metric", "mickey", "middle", "midway", "mighty", "miller", "minded", "mining", "minute", "mirror", "misery", "mobile", "modern", "modest", "modify", "module", "moment", "morale", "morris", "mortar", "mosaic", "mostly", "mother", "motion", "motive", "moving", "murder", "muscle", "museum", "mutual", "myriad", "myself", "namely", "narrow", "nation", "native", "nature", "nearby", "nearly", "needle", "nelson", "nephew", "neural", "newton", "nights", "ninety", "nobody", "normal", "notice", "notify", "notion", "novice", "number", "object", "obtain", "occupy", "office", "offset", "online", "opener", "oppose", "option", "oracle", "orange", "origin", "outfit", "outing", "outlet", "output", "outset", "oxford", "oxygen", "packed", "packet", "palace", "palmer", "parade", "parcel", "pardon", "parent", "parish", "parity", "partly", "patent", "patrol", "patron", "paving", "pencil", "people", "pepper", "period", "permit", "person", "pharma", "phrase", "picked", "pickup", "picnic", "pierce", "plague", "planet", "plasma", "player", "please", "pledge", "plenty", "plight", "plunge", "pocket", "poetic", "poetry", "poised", "poison", "police", "policy", "polish", "polite", "poorly", "portal", "porter", "postal", "poster", "potato", "potent", "potter", "powder", "praise", "prayer", "prefer", "pretty", "priest", "prince", "prison", "profit", "prompt", "proper", "proven", "public", "purity", "purple", "pursue", "puzzle", "quartz", "rabbit", "racial", "racism", "radius", "raised", "random", "rarely", "rather", "rating", "reader", "really", "reason", "recall", "recent", "recipe", "record", "reduce", "reform", "refuge", "refund", "refuse", "regain", "regard", "regime", "region", "regret", "reject", "relate", "relief", "remain", "remark", "remedy", "remind", "remote", "remove", "render", "rental", "repaid", "repair", "repeat", "replay", "report", "rescue", "reseda", "reside", "resign", "resist", "resort", "result", "resume", "retail", "retain", "retire", "return", "reveal", "review", "revise", "reward", "rhythm", "ribbon", "riding", "ripped", "rising", "ritual", "robust", "rocket", "roller", "rubber", "rugged", "ruling", "runner", "sacred", "saddle", "safety", "salary", "salmon", "sample", "savage", "saving", "saying", "scarce", "scheme", "school", "scream", "screen", "script", "search", "season", "second", "secret", "sector", "secure", "seeing", "seldom", "select", "seller", "senate", "senior", "sensor", "serial", "series", "server", "settle", "severe", "sewage", "sexual", "shadow", "shaken", "sheila", "sherry", "shield", "should", "shower", "shrink", "sierra", "signal", "signed", "silent", "silver", "simple", "simply", "singer", "single", "sister", "sketch", "sleeve", "slight", "slogan", "smooth", "soccer", "social", "socket", "sodium", "solely", "sooner", "sought", "source", "soviet", "speech", "speedy", "sphere", "spider", "spinal", "spiral", "spirit", "splash", "spoken", "spouse", "spread", "spring", "sprint", "square", "stable", "stance", "static", "statue", "status", "steady", "stereo", "sticky", "stolen", "strain", "strand", "streak", "stream", "street", "stress", "strict", "stride", "strike", "string", "strive", "stroke", "strong", "struck", "studio", "stupid", "submit", "subtle", "suburb", "sudden", "suffer", "sulfur", "summer", "summit", "sunset", "superb", "supper", "supply", "surely", "surrey", "survey", "switch", "symbol", "system", "tablet", "tackle", "tailor", "taking", "talent", "tandem", "target", "tariff", "taught", "temper", "temple", "tenant", "tender", "tennis", "tenure", "terror", "thanks", "theirs", "theory", "thesis", "thirty", "though", "thread", "threat", "thrill", "thrive", "throat", "throne", "thrown", "thrust", "ticket", "timber", "timely", "timing", "tissue", "titled", "toilet", "tomato", "tongue", "torque", "touche", "toward", "trader", "tragic", "trauma", "travel", "treaty", "tribal", "tricky", "triple", "trophy", "trying", "tunnel", "turkey", "turner", "twelve", "twenty", "unable", "uneasy", "uneven", "unfair", "unique", "united", "unless", "unlike", "unlock", "unpaid", "unrest", "unsure", "unused", "update", "upheld", "upload", "uptime", "upward", "urgent", "usable", "useful", "utmost", "vacant", "vacuum", "valley", "varied", "vector", "velvet", "vendor", "verbal", "verify", "versus", "vessel", "vested", "viable", "victim", "victor", "viewer", "virgin", "virtue", "vision", "visual", "voiced", "volume", "walker", "wallet", "walnut", "warmth", "warren", "wasted", "wealth", "weapon", "weaver", "weekly", "weight", "whilst", "wholly", "wicked", "window", "winner", "winter", "wiring", "wisdom", "within", "wizard", "wonder", "wooden", "worker", "worthy", "wright", "writer", "yearly", "yellow"];

function generateWordTest(){
    const element = document.getElementById('current_word');
    element.textContent = many_words[Math.floor(Math.random() * 1000) - 1]; 
    return;
}

function generateWord(){
    return many_words[Math.floor(Math.random() * 1000) - 1]; 
}
