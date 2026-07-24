import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.Base64;

public class KaggleDownload {
    public static void main(String[] args) throws Exception {
        String username = args.length > 0 ? args[0] : System.getenv("KAGGLE_USERNAME");
        String key = args.length > 1 ? args[1] : System.getenv("KAGGLE_KEY");
        String dataset = args.length > 2 ? args[2] : "crawford/80-cereals";

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Provide a Kaggle username or set KAGGLE_USERNAME.");
        }
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("Provide a Kaggle API key or set KAGGLE_KEY.");
        }

        String auth = Base64.getEncoder().encodeToString((username + ":" + key).getBytes("UTF-8"));
        String url = "https://www.kaggle.com/api/v1/datasets/download/" + dataset;

        Path outputDir = Paths.get("backend", "data");
        Files.createDirectories(outputDir);
        Path outputFile = outputDir.resolve(dataset.replace('/', '_') + ".zip");

        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Authorization", "Basic " + auth);
        connection.setRequestProperty("User-Agent", "Mozilla/5.0");

        int status = connection.getResponseCode();
        if (status != HttpURLConnection.HTTP_OK) {
            InputStream errorStream = connection.getErrorStream();
            String body = errorStream == null ? "" : new String(errorStream.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
            throw new RuntimeException("Kaggle request failed with status " + status + ": " + body);
        }

        try (InputStream input = connection.getInputStream();
             OutputStream output = Files.newOutputStream(outputFile)) {
            input.transferTo(output);
        }

        System.out.println("Downloaded to " + outputFile.toAbsolutePath());
    }
}
