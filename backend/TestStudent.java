import java.sql.Connection;
import java.sql.PreparedStatement;

public class TestStudent {

    public static void main(String[] args) {

        Connection connection = DataBaseConnection.getConnection();

        if (connection != null) {

            String sql = "INSERT INTO students (name, target_role, skill_level) VALUES (?, ?, ?)";

            try {
                PreparedStatement statement = connection.prepareStatement(sql);

                statement.setString(1, "Test Student");
                statement.setString(2, "Java Full Stack Developer");
                statement.setString(3, "Beginner");

                statement.executeUpdate();

                System.out.println("Student added successfully!");

                statement.close();
                connection.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}