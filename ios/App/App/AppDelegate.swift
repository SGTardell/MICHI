import UIKit
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        let viewController = MichiWebViewController()
        window.rootViewController = viewController
        window.makeKeyAndVisible()
        self.window = window
        return true
    }
}

class MichiWebViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    var webView: WKWebView!

    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.preferences.javaScriptEnabled = true
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 9/255, green: 13/255, blue: 22/255, alpha: 1.0)
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let bundle = Bundle.main
        var htmlUrl: URL? = nil
        
        // Priority 1: Launch to index.html (Login & Create Account screen)
        if let url = bundle.url(forResource: "index", withExtension: "html", subdirectory: "public") {
            htmlUrl = url
        } else if let url = bundle.url(forResource: "index", withExtension: "html") {
            htmlUrl = url
        } else if let url = bundle.url(forResource: "dashboard", withExtension: "html", subdirectory: "public") {
            htmlUrl = url
        } else if let url = bundle.url(forResource: "dashboard", withExtension: "html") {
            htmlUrl = url
        }
        
        if let url = htmlUrl {
            let readAccessUrl = url.deletingLastPathComponent()
            webView.loadFileURL(url, allowingReadAccessTo: readAccessUrl)
        } else {
            let htmlString = """
            <!DOCTYPE html>
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{background:#090d16;color:#f8fafc;font-family:sans-serif;text-align:center;padding:40px;}</style></head>
            <body><h2>MICHI</h2><p>Welcome to MICHI Mobile</p></body>
            </html>
            """
            webView.loadHTMLString(htmlString, baseURL: nil)
        }
    }
}
