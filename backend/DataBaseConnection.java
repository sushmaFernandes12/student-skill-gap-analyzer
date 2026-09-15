import java.sql.Connection;
import java.sql.DriverManager;
public class DataBaseConnection {

    public static Connection getConnection() {
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/Skill_gap_analyzer",
                "root",
                "Sushma"
            );

            System.out.println("Database connected successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }

        return connection;
    }

    public static void main(String[] args) {
        getConnection();
    }
}