type Extra = {
  pos: string;
  lines: [string, string][];
  related?: string[];
};

const entries: Record<string, Extra> = {
  http: {
    pos: '名词',
    related: ['https', 'request', 'protocol'],
    lines: [
      ['The browser loads a page over HTTP.', '浏览器通过 HTTP 加载网页。'],
      ['HTTP is a rule for sending web pages.', 'HTTP 是传送网页用的一套规则。'],
      ['Without HTTP, a browser and a server cannot trade pages.', '没有 HTTP，浏览器和服务器就对不上网页怎么传。'],
    ],
  },
  https: {
    pos: '名词',
    related: ['http', 'certificate', 'encryption'],
    lines: [
      ['The bank site uses HTTPS.', '银行网站使用 HTTPS。'],
      ['HTTPS keeps the page hidden from people on the path.', 'HTTPS 让路上的人看不懂网页内容。'],
    ],
  },
  dns: {
    pos: '名词',
    related: ['ip', 'url', 'server'],
    lines: [
      ['DNS turns a site name into a number.', 'DNS 把网站名字换成数字地址。'],
      ['The computer asks DNS before it opens the site.', '电脑打开网站前会先问 DNS。'],
    ],
  },
  ip: {
    pos: '名词',
    related: ['dns', 'packet', 'router'],
    lines: [
      ['Every phone on the network has an IP.', '每台上网的手机都有一个 IP。'],
      ['Packets are sent to that IP.', '数据包会送到那个 IP。'],
    ],
  },
  tcp: {
    pos: '名词',
    related: ['udp', 'packet', 'port'],
    lines: [
      ['A file download often uses TCP.', '下载文件常常使用 TCP。'],
      ['TCP sends missing pieces again.', 'TCP 会把丢掉的部分再发一次。'],
    ],
  },
  udp: {
    pos: '名词',
    related: ['tcp', 'packet', 'latency'],
    lines: [
      ['A voice call can use UDP.', '语音通话可以使用 UDP。'],
      ['UDP does not wait to confirm every piece.', 'UDP 不会等每一小段都被确认。'],
    ],
  },
  router: {
    pos: '名词',
    related: ['packet', 'ip', 'bandwidth'],
    lines: [
      ['The phone joins the network through a Router.', '手机通过 Router 接入网络。'],
      ['A Router chooses the next hop for each packet.', 'Router 为每个数据包选择下一跳。'],
    ],
  },
  packet: {
    pos: '名词',
    related: ['router', 'tcp', 'ip'],
    lines: [
      ['A photo is split into many Packet pieces.', '一张照片会被拆成很多 Packet。'],
      ['Each Packet carries a from and a to.', '每个 Packet 都写着从哪来、到哪去。'],
    ],
  },
  port: {
    pos: '名词',
    related: ['server', 'tcp', 'protocol'],
    lines: [
      ['A website often listens on Port 443.', '网站常常在 Port 443 上等待连接。'],
      ['The Port tells the computer which service you want.', 'Port 用来区分你要的是哪一种服务。'],
    ],
  },
  bandwidth: {
    pos: '名词',
    related: ['latency', 'packet', 'router'],
    lines: [
      ['Low Bandwidth makes video pause.', 'Bandwidth 太小，视频就会卡住。'],
      ['Bandwidth is how much data can pass at once.', 'Bandwidth 是同一时间能通过多少数据。'],
    ],
  },
  latency: {
    pos: '名词',
    related: ['bandwidth', 'udp', 'packet'],
    lines: [
      ['High Latency makes a game feel late.', 'Latency 太高，游戏就会觉得慢半拍。'],
      ['Latency is the wait between a click and a reply.', 'Latency 是点击之后要等多久才有回应。'],
    ],
  },
  protocol: {
    pos: '名词',
    related: ['http', 'tcp', 'port'],
    lines: [
      ['A Protocol is a shared rule for talking.', 'Protocol 是双方约好的说话规则。'],
      ['HTTP is one Protocol used for web pages.', 'HTTP 是用来传网页的一种 Protocol。'],
    ],
  },
  client: {
    pos: '名词',
    related: ['server', 'request', 'http'],
    lines: [
      ['The browser is a Client.', '浏览器是一个 Client。'],
      ['A Client asks another machine for data.', 'Client 向另一台机器要数据。'],
    ],
  },
  server: {
    pos: '名词',
    related: ['client', 'response', 'request'],
    lines: [
      ['The Server stores the website.', '网站放在 Server 上。'],
      ['A Server waits for clients to ask.', 'Server 等着客户端来要数据。'],
    ],
  },
  variable: {
    pos: '名词',
    related: ['function', 'string', 'parameter'],
    lines: [
      ['Age can live in a Variable.', '年龄可以放进一个 Variable。'],
      ['A Variable keeps its name while the value changes.', 'Variable 的名字可以不变，里面的值可以换。'],
    ],
  },
  function: {
    pos: '名词',
    related: ['parameter', 'return', 'variable'],
    lines: [
      ['Put the steps in a Function.', '把步骤放进一个 Function。'],
      ['Call the Function whenever you need those steps.', '需要这些步骤时就调用这个 Function。'],
    ],
  },
  array: {
    pos: '名词',
    related: ['object', 'loop', 'string'],
    lines: [
      ['The cart items sit in an Array.', '购物车里的商品放在一个 Array 里。'],
      ['An Array keeps items in order.', 'Array 按顺序存放多项数据。'],
    ],
  },
  string: {
    pos: '名词',
    related: ['variable', 'array', 'boolean'],
    lines: [
      ['A nickname is stored as a String.', '昵称通常存成 String。'],
      ['A String is text, not a number for math.', 'String 是文字，不能直接拿来做算术。'],
    ],
  },
  boolean: {
    pos: '名词',
    related: ['variable', 'function', 'return'],
    lines: [
      ['Login state can be a Boolean.', '是否登录可以用 Boolean 表示。'],
      ['A Boolean is only true or false.', 'Boolean 只有真和假两种可能。'],
    ],
  },
  loop: {
    pos: '名词',
    related: ['array', 'function', 'algorithm'],
    lines: [
      ['A Loop sends one email per person.', 'Loop 可以给名单里的每个人发一封信。'],
      ['Use a Loop instead of copying the same lines.', '用 Loop，就不用把同一段代码复制很多遍。'],
    ],
  },
  class: {
    pos: '名词',
    related: ['object', 'function', 'variable'],
    lines: [
      ['A user Class describes every user.', '用户 Class 描述所有用户共有的样子。'],
      ['A Class is the plan, and objects are the real items.', 'Class 是图纸，对象才是做出来的东西。'],
    ],
  },
  object: {
    pos: '名词',
    related: ['class', 'array', 'string'],
    lines: [
      ['The logged-in person is one Object.', '当前登录的人是一个 Object。'],
      ['Each Object can share a class and still differ.', '每个 Object 可以来自同一个类，内容却不同。'],
    ],
  },
  algorithm: {
    pos: '名词',
    related: ['loop', 'function', 'compiler'],
    lines: [
      ['Sorting names needs an Algorithm.', '给名字排序需要一个 Algorithm。'],
      ['A different Algorithm can be faster.', '换一个 Algorithm，可能会更快。'],
    ],
  },
  compiler: {
    pos: '名词',
    related: ['syntax', 'debug', 'algorithm'],
    lines: [
      ['The Compiler checks the code first.', 'Compiler 会先检查代码。'],
      ['A Compiler turns source code into a program.', 'Compiler 把源代码变成可以运行的程序。'],
    ],
  },
  debug: {
    pos: '动词',
    related: ['compiler', 'syntax', 'function'],
    lines: [
      ['Debug the page when the button is missing.', '按钮没出现时，要 Debug 这个页面。'],
      ['To Debug is to find why the program is wrong.', 'Debug 就是找出程序为什么和预想不一样。'],
    ],
  },
  syntax: {
    pos: '名词',
    related: ['compiler', 'debug', 'function'],
    lines: [
      ['A missing bracket is a Syntax error.', '少一个括号就是 Syntax 错误。'],
      ['Syntax is the writing rule of a language.', 'Syntax 是一门语言规定的写法。'],
    ],
  },
  parameter: {
    pos: '名词',
    related: ['function', 'return', 'variable'],
    lines: [
      ['Pass the price as a Parameter.', '把价格作为 Parameter 传进去。'],
      ['A Parameter is the input a function expects.', 'Parameter 是函数这次要处理的原料。'],
    ],
  },
  return: {
    pos: '动词',
    related: ['function', 'parameter', 'variable'],
    lines: [
      ['The function will Return the total.', '函数会 Return 合计的结果。'],
      ['Return hands the result back to the caller.', 'Return 把结果交回给调用的人。'],
    ],
  },
  database: {
    pos: '名词',
    related: ['table', 'sql', 'query'],
    lines: [
      ['User names live in a Database.', '用户名单存在 Database 里。'],
      ['A Database keeps data after the page closes.', '关掉页面之后，Database 里的数据还在。'],
    ],
  },
  sql: {
    pos: '名词',
    related: ['query', 'table', 'database'],
    lines: [
      ['Write SQL to find unpaid orders.', '写 SQL 来找出未付款的订单。'],
      ['SQL is the language used to ask a database.', 'SQL 是用来询问数据库的语言。'],
    ],
  },
  table: {
    pos: '名词',
    related: ['row', 'column', 'database'],
    lines: [
      ['Each user is a row in the Table.', '每个用户是 Table 里的一行。'],
      ['A Table looks like a grid of rows and columns.', 'Table 像一张由行和列组成的表。'],
    ],
  },
  row: {
    pos: '名词',
    related: ['table', 'column', 'primary-key'],
    lines: [
      ['A new user adds one Row.', '新用户会让表多出一行 Row。'],
      ['A Row is one complete record.', 'Row 是一条完整的记录。'],
    ],
  },
  column: {
    pos: '名词',
    related: ['table', 'row', 'schema'],
    lines: [
      ['The email Column stores only emails.', '邮箱这一 Column 只放邮箱。'],
      ['A Column is one kind of fact in a table.', 'Column 是表里的同一种信息。'],
    ],
  },
  'primary-key': {
    pos: '名词',
    related: ['foreign-key', 'row', 'table'],
    lines: [
      ['User id is a good Primary Key.', '用户编号适合做 Primary Key。'],
      ['A Primary Key makes every row unique.', 'Primary Key 让每一行都能被单独认出来。'],
    ],
  },
  'foreign-key': {
    pos: '名词',
    related: ['primary-key', 'join', 'table'],
    lines: [
      ['The order stores a Foreign Key to the user.', '订单用 Foreign Key 指向用户。'],
      ['A Foreign Key links two tables.', 'Foreign Key 把两张表连起来。'],
    ],
  },
  query: {
    pos: '名词',
    related: ['sql', 'index', 'table'],
    lines: [
      ['Today orders are one Query.', '找出今天的订单，就是一次 Query。'],
      ['A Query asks the database a question.', 'Query 是向数据库提的一个问题。'],
    ],
  },
  index: {
    pos: '名词',
    related: ['query', 'column', 'table'],
    lines: [
      ['An Index on email makes lookup faster.', '给邮箱加 Index，查找会更快。'],
      ['An Index is like the index at the back of a book.', 'Index 像书后面的检索表。'],
    ],
  },
  schema: {
    pos: '名词',
    related: ['table', 'column', 'database'],
    lines: [
      ['Change the Schema before storing a new fact.', '存新数据前，先改 Schema。'],
      ['A Schema is the plan of tables and columns.', 'Schema 是表和列的设计图。'],
    ],
  },
  transaction: {
    pos: '名词',
    related: ['commit', 'rollback', 'database'],
    lines: [
      ['A transfer should be one Transaction.', '转账应该放在一个 Transaction 里。'],
      ['A Transaction succeeds all together or not at all.', 'Transaction 要么全部成功，要么全部不算。'],
    ],
  },
  commit: {
    pos: '动词',
    related: ['transaction', 'rollback', 'database'],
    lines: [
      ['Commit the order after the check passes.', '检查通过后再 Commit 订单。'],
      ['Commit makes the change visible to others.', 'Commit 之后，别人就能看到这次修改。'],
    ],
  },
  rollback: {
    pos: '动词',
    related: ['transaction', 'commit', 'database'],
    lines: [
      ['Rollback when the payment fails.', '付款失败时要 Rollback。'],
      ['Rollback undoes the half-finished change.', 'Rollback 把做到一半的修改撤回去。'],
    ],
  },
  join: {
    pos: '动词',
    related: ['foreign-key', 'table', 'query'],
    lines: [
      ['JOIN the order table with the user table.', '用 JOIN 把订单表和用户表拼起来。'],
      ['JOIN shows related rows from two tables.', 'JOIN 用来同时看到两张表里相关的行。'],
    ],
  },
  kernel: {
    pos: '名词',
    related: ['process', 'memory', 'driver'],
    lines: [
      ['Reading a disk goes through the Kernel.', '读硬盘要经过 Kernel。'],
      ['The Kernel manages hardware for other programs.', 'Kernel 替其他程序管理硬件。'],
    ],
  },
  process: {
    pos: '名词',
    related: ['thread', 'memory', 'scheduler'],
    lines: [
      ['The browser is one Process.', '浏览器是一个 Process。'],
      ['Closing the window ends that Process.', '关掉窗口，这个 Process 就结束了。'],
    ],
  },
  thread: {
    pos: '名词',
    related: ['process', 'scheduler', 'memory'],
    lines: [
      ['One Thread can play video.', '一个 Thread 可以负责播放视频。'],
      ['One process can hold more than one Thread.', '一个进程里可以有不止一条 Thread。'],
    ],
  },
  memory: {
    pos: '名词',
    related: ['process', 'cache', 'kernel'],
    lines: [
      ['Too many tabs raise Memory use.', '标签页太多，Memory 占用就会升高。'],
      ['Memory is the temporary desk of the computer.', 'Memory 是电脑正在使用的临时工作台。'],
    ],
  },
  'file-system': {
    pos: '名词',
    related: ['path', 'driver', 'kernel'],
    lines: [
      ['Photos are laid out by the File System.', '照片由 File System 在硬盘上摆放。'],
      ['A File System decides how files are found.', 'File System 决定文件怎样被找到。'],
    ],
  },
  shell: {
    pos: '名词',
    related: ['path', 'process', 'boot'],
    lines: [
      ['Type a command in the Shell.', '在 Shell 里输入命令。'],
      ['A Shell lets you operate the computer with text.', 'Shell 让你用文字操作电脑。'],
    ],
  },
  scheduler: {
    pos: '名词',
    related: ['process', 'thread', 'kernel'],
    lines: [
      ['The Scheduler shares the processor.', 'Scheduler 把处理器时间分给各个程序。'],
      ['A Scheduler decides who runs next.', 'Scheduler 决定接下来谁先运行。'],
    ],
  },
  deadlock: {
    pos: '名词',
    related: ['process', 'thread', 'scheduler'],
    lines: [
      ['Two programs can enter a Deadlock.', '两个程序可能进入 Deadlock。'],
      ['A Deadlock means each one waits for the other.', 'Deadlock 就是双方互相等着对方先松手。'],
    ],
  },
  interrupt: {
    pos: '名词',
    related: ['kernel', 'driver', 'process'],
    lines: [
      ['A key press raises an Interrupt.', '按键会产生 Interrupt。'],
      ['An Interrupt asks the processor to handle something now.', 'Interrupt 是让处理器先去处理一件急事。'],
    ],
  },
  driver: {
    pos: '名词',
    related: ['kernel', 'file-system', 'boot'],
    lines: [
      ['Install a Driver for the new printer.', '新打印机要安装 Driver。'],
      ['A Driver teaches the system how to use hardware.', 'Driver 让系统听得懂某一种硬件。'],
    ],
  },
  boot: {
    pos: '动词',
    related: ['kernel', 'driver', 'memory'],
    lines: [
      ['The computer will Boot into the system.', '电脑会 Boot 进入系统。'],
      ['To Boot is to start from power-on to ready.', 'Boot 是从按下电源到系统准备好的过程。'],
    ],
  },
  path: {
    pos: '名词',
    related: ['file-system', 'shell', 'driver'],
    lines: [
      ['A wrong Path means the file is not found.', 'Path 写错了，就会找不到文件。'],
      ['A Path is the written location of a file.', 'Path 是文件位置的写法。'],
    ],
  },
  cache: {
    pos: '名词',
    related: ['memory', 'latency', 'process'],
    lines: [
      ['The browser keeps the picture in Cache.', '浏览器把图片放进 Cache。'],
      ['Cache makes the next open faster.', 'Cache 让下一次打开更快。'],
    ],
  },
  encryption: {
    pos: '名词',
    related: ['https', 'password', 'hash'],
    lines: [
      ['Chat apps use Encryption.', '聊天软件使用 Encryption。'],
      ['Encryption makes a message unreadable without the key.', '没有钥匙时，Encryption 让消息读不懂。'],
    ],
  },
  password: {
    pos: '名词',
    related: ['authentication', 'hash', 'token'],
    lines: [
      ['Type the Password to sign in.', '输入 Password 才能登录。'],
      ['Do not reuse one Password on every site.', '不要在所有网站用同一个 Password。'],
    ],
  },
  token: {
    pos: '名词',
    related: ['password', 'authentication', 'request'],
    lines: [
      ['The server returns a Token after login.', '登录成功后，服务器发回一个 Token。'],
      ['Later requests carry that Token.', '之后的请求带上这个 Token。'],
    ],
  },
  hash: {
    pos: '名词',
    related: ['password', 'encryption', 'authentication'],
    lines: [
      ['The site stores a Hash of the password.', '网站保存的是密码的 Hash。'],
      ['A Hash changes completely if one letter changes.', '改一个字母，Hash 就会完全不同。'],
    ],
  },
  firewall: {
    pos: '名词',
    related: ['vpn', 'malware', 'port'],
    lines: [
      ['A Firewall blocks unknown connections.', 'Firewall 拦住不认识的连接。'],
      ['A Firewall decides what may enter the computer.', 'Firewall 决定哪些连接可以进来。'],
    ],
  },
  authentication: {
    pos: '名词',
    related: ['password', 'authorization', 'token'],
    lines: [
      ['A password check is Authentication.', '核对密码属于 Authentication。'],
      ['Authentication answers who you are.', 'Authentication 用来确认你是谁。'],
    ],
  },
  authorization: {
    pos: '名词',
    related: ['authentication', 'token', 'backend'],
    lines: [
      ['Deleting every user fails Authorization.', '删除所有用户会在 Authorization 被拒绝。'],
      ['Authorization checks what you are allowed to do.', 'Authorization 检查你有没有资格做这件事。'],
    ],
  },
  certificate: {
    pos: '名词',
    related: ['https', 'encryption', 'phishing'],
    lines: [
      ['The browser checks the Certificate.', '浏览器会检查 Certificate。'],
      ['A Certificate helps prove the site is real.', 'Certificate 用来证明这个网站是真的。'],
    ],
  },
  vpn: {
    pos: '名词',
    related: ['encryption', 'firewall', 'ip'],
    lines: [
      ['Connect the company VPN before opening the tool.', '打开内部系统前，先连上公司 VPN。'],
      ['A VPN is an encrypted path across a public network.', 'VPN 是在公共网络上的一条加密通道。'],
    ],
  },
  malware: {
    pos: '名词',
    related: ['phishing', 'firewall', 'patch'],
    lines: [
      ['An unknown file may be Malware.', '来历不明的文件可能是 Malware。'],
      ['Malware is software written to do harm.', 'Malware 是故意做坏事的软件。'],
    ],
  },
  phishing: {
    pos: '名词',
    related: ['malware', 'password', 'certificate'],
    lines: [
      ['That urgent email may be Phishing.', '那封催你改密码的邮件可能是 Phishing。'],
      ['Phishing tricks you into giving away a password.', 'Phishing 是骗你交出密码的手法。'],
    ],
  },
  vulnerability: {
    pos: '名词',
    related: ['patch', 'malware', 'firewall'],
    lines: [
      ['An old app may contain a Vulnerability.', '旧版本软件里可能有 Vulnerability。'],
      ['A Vulnerability is a weakness someone can abuse.', 'Vulnerability 是可以被人利用的弱点。'],
    ],
  },
  patch: {
    pos: '名词',
    related: ['vulnerability', 'malware', 'boot'],
    lines: [
      ['Install the Patch when the system asks.', '系统提示时，安装 Patch。'],
      ['A Patch fixes a known weakness.', 'Patch 用来修掉已经公开的漏洞。'],
    ],
  },
  html: {
    pos: '名词',
    related: ['css', 'dom', 'javascript'],
    lines: [
      ['A paragraph of text lives in HTML.', '一段文字写在 HTML 里。'],
      ['HTML marks what is on the page.', 'HTML 用来标记网页上有什么。'],
    ],
  },
  css: {
    pos: '名词',
    related: ['html', 'frontend', 'dom'],
    lines: [
      ['CSS makes the title green.', 'CSS 把标题变成绿色。'],
      ['CSS controls color, size, and spacing.', 'CSS 负责颜色、字号和间距。'],
    ],
  },
  javascript: {
    pos: '名词',
    related: ['dom', 'html', 'frontend'],
    lines: [
      ['The alert box is written in JavaScript.', '提示框通常是 JavaScript 写的。'],
      ['JavaScript lets the page react to a click.', 'JavaScript 让网页能对点击做出反应。'],
    ],
  },
  dom: {
    pos: '名词',
    related: ['html', 'javascript', 'css'],
    lines: [
      ['Script finds the title through the DOM.', '脚本通过 DOM 找到标题。'],
      ['The DOM is the page turned into a tree of objects.', 'DOM 是浏览器把网页变成的一棵对象树。'],
    ],
  },
  api: {
    pos: '名词',
    related: ['json', 'request', 'backend'],
    lines: [
      ['The weather app calls an API.', '天气应用会调用一个 API。'],
      ['An API is a door one program opens for another.', 'API 是一个程序留给别的程序用的入口。'],
    ],
  },
  json: {
    pos: '名词',
    related: ['api', 'request', 'response'],
    lines: [
      ['The name and age come back as JSON.', '名字和年龄以 JSON 返回。'],
      ['JSON is a text shape for data.', 'JSON 是一种用文字写数据的格式。'],
    ],
  },
  url: {
    pos: '名词',
    related: ['dns', 'http', 'request'],
    lines: [
      ['Send the URL to a friend.', '把 URL 发给朋友。'],
      ['A URL is the address of one page or file.', 'URL 是某个页面或文件的地址。'],
    ],
  },
  cookie: {
    pos: '名词',
    related: ['frontend', 'request', 'token'],
    lines: [
      ['A Cookie can keep you signed in.', 'Cookie 可以让你保持登录。'],
      ['The browser sends the Cookie back next time.', '下次访问时，浏览器会再带上 Cookie。'],
    ],
  },
  frontend: {
    pos: '名词',
    related: ['backend', 'css', 'javascript'],
    lines: [
      ['Button color is part of the Frontend.', '按钮颜色属于 Frontend。'],
      ['The Frontend is the part people see and tap.', 'Frontend 是人看得到、点得到的那一层。'],
    ],
  },
  backend: {
    pos: '名词',
    related: ['frontend', 'api', 'database'],
    lines: [
      ['The Backend checks the password.', '核对密码是 Backend 做的事。'],
      ['The Backend runs on a server, out of sight.', 'Backend 在服务器上运行，用户通常看不见。'],
    ],
  },
  request: {
    pos: '名词',
    related: ['response', 'http', 'api'],
    lines: [
      ['Login sends a Request.', '登录时会发出一个 Request。'],
      ['A Request tells the server what you want.', 'Request 告诉服务器你想要什么。'],
    ],
  },
  response: {
    pos: '名词',
    related: ['request', 'server', 'json'],
    lines: [
      ['The page comes back in the Response.', '页面放在 Response 里送回来。'],
      ['A Response is the server reply.', 'Response 是服务器的回复。'],
    ],
  },
};

const groups = [
  ['http', 'https', 'dns', 'ip', 'tcp', 'udp', 'router', 'packet', 'port', 'bandwidth', 'latency', 'protocol', 'client', 'server'],
  ['variable', 'function', 'array', 'string', 'boolean', 'loop', 'class', 'object', 'algorithm', 'compiler', 'debug', 'syntax', 'parameter', 'return'],
  ['database', 'sql', 'table', 'row', 'column', 'primary-key', 'foreign-key', 'query', 'index', 'schema', 'transaction', 'commit', 'rollback', 'join'],
  ['kernel', 'process', 'thread', 'memory', 'file-system', 'shell', 'scheduler', 'deadlock', 'interrupt', 'driver', 'boot', 'path', 'cache'],
  ['encryption', 'password', 'token', 'hash', 'firewall', 'authentication', 'authorization', 'certificate', 'vpn', 'malware', 'phishing', 'vulnerability', 'patch'],
  ['html', 'css', 'javascript', 'dom', 'api', 'json', 'url', 'cookie', 'frontend', 'backend', 'request', 'response'],
];

function neighbors(id: string): string[] {
  for (const group of groups) {
    const index = group.indexOf(id);
    if (index < 0) continue;
    const picks: string[] = [];
    for (let step = 1; picks.length < 3; step += 1) {
      picks.push(group[(index + step) % group.length]);
    }
    return picks;
  }
  return [];
}

export const enrichment: Record<string, { pos: string; lines: [string, string][]; related: string[] }> =
  Object.fromEntries(
    Object.entries(entries).map(([id, extra]) => [
      id,
      { pos: extra.pos, lines: extra.lines, related: extra.related ?? neighbors(id) },
    ]),
  );
