import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StudentAPI {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
            new InetSocketAddress(8080), 0
        );

        server.createContext(
            "/api/students",
            StudentAPI::handleStudent
        );

        server.createContext(
            "/api/skills",
            StudentAPI::handleSkills
        );

        server.createContext(
            "/api/history",
            StudentAPI::handleHistory
        );

        server.start();

        System.out.println(
            "Backend API running on http://localhost:8080"
        );
    }


    /* =========================================
       STUDENT API
       ========================================= */

    private static void handleStudent(HttpExchange exchange)
            throws IOException {

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Origin", "*"
        );

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Methods",
            "POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );


        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(204, -1);
            return;
        }


        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            String response =
                "{\"error\":\"Only POST method is allowed\"}";

            sendResponse(exchange, 405, response);
            return;
        }


        try {

            InputStream input =
                exchange.getRequestBody();

            String json =
                new String(
                    input.readAllBytes(),
                    StandardCharsets.UTF_8
                );


            System.out.println(
                "Received data: " + json
            );


            String name =
                getValue(json, "name");

            String role =
                getValue(json, "target_role");

            String level =
                getValue(json, "skill_level");


            List<String> missingSkills =
                getMissingSkills(json);


            Connection connection =
                DataBaseConnection.getConnection();


            if (connection == null) {

                throw new Exception(
                    "Database connection failed"
                );
            }


            /* SAVE STUDENT */

            String sql =
                "INSERT INTO students " +
                "(name, target_role, skill_level) " +
                "VALUES (?, ?, ?)";


            PreparedStatement statement =
                connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
                );


            statement.setString(1, name);
            statement.setString(2, role);
            statement.setString(3, level);


            statement.executeUpdate();


            int studentId = 0;


            ResultSet keys =
                statement.getGeneratedKeys();


            if (keys.next()) {

                studentId =
                    keys.getInt(1);
            }


            keys.close();
            statement.close();


            /* SAVE MISSING SKILLS */

            String gapSql =
                "INSERT INTO skill_gap " +
                "(student_id, skill_name, skill_status) " +
                "VALUES (?, ?, ?)";


            PreparedStatement gapStatement =
                connection.prepareStatement(gapSql);


            for (String skill : missingSkills) {

                gapStatement.setInt(
                    1,
                    studentId
                );

                gapStatement.setString(
                    2,
                    skill
                );

                gapStatement.setString(
                    3,
                    "Missing"
                );

                gapStatement.addBatch();
            }


            if (!missingSkills.isEmpty()) {

                gapStatement.executeBatch();
            }


            gapStatement.close();
            connection.close();


            String response =
                "{\"message\":\"Student and skill gap saved successfully\"}";


            sendResponse(
                exchange,
                200,
                response
            );


        } catch (Exception e) {

            e.printStackTrace();


            String response =
                "{\"error\":\"Failed to save student\"}";


            sendResponse(
                exchange,
                500,
                response
            );
        }
    }


    /* =========================================
       GET STRING VALUE
       ========================================= */

    private static String getValue(
            String json,
            String key) {

        String search =
            "\"" + key + "\":\"";


        int start =
            json.indexOf(search);


        if (start == -1) {

            return "";
        }


        start += search.length();


        int end =
            json.indexOf("\"", start);


        if (end == -1) {

            return "";
        }


        return json.substring(
            start,
            end
        );
    }


    /* =========================================
       GET MISSING SKILLS
       ========================================= */

    private static List<String> getMissingSkills(
            String json) {

        List<String> skills =
            new ArrayList<>();


        String search =
            "\"missing_skills\":[";


        int start =
            json.indexOf(search);


        if (start == -1) {

            return skills;
        }


        start += search.length();


        int end =
            json.indexOf("]", start);


        if (end == -1) {

            return skills;
        }


        String skillsPart =
            json.substring(start, end);


        Pattern pattern =
            Pattern.compile("\"([^\"]*)\"");


        Matcher matcher =
            pattern.matcher(skillsPart);


        while (matcher.find()) {

            skills.add(
                matcher.group(1)
            );
        }


        return skills;
    }


    /* =========================================
       SKILLS API
       ========================================= */

    private static void handleSkills(
            HttpExchange exchange)
            throws IOException {

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Origin", "*"
        );


        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("GET")) {

            String response =
                "{\"error\":\"Only GET method is allowed\"}";

            sendResponse(
                exchange,
                405,
                response
            );

            return;
        }


        try {

            Connection connection =
                DataBaseConnection.getConnection();


            if (connection == null) {

                throw new Exception(
                    "Database connection failed"
                );
            }


            String sql =
                "SELECT skill_name, target_role FROM skills";


            PreparedStatement statement =
                connection.prepareStatement(sql);


            ResultSet result =
                statement.executeQuery();


            StringBuilder response =
                new StringBuilder("[");


            boolean first = true;


            while (result.next()) {

                if (!first) {

                    response.append(",");

                }


                response.append(
                    "{\"skill_name\":\""
                );


                response.append(
                    result.getString("skill_name")
                );


                response.append(
                    "\",\"target_role\":\""
                );


                response.append(
                    result.getString("target_role")
                );


                response.append("\"}");


                first = false;
            }


            response.append("]");


            result.close();
            statement.close();
            connection.close();


            sendResponse(
                exchange,
                200,
                response.toString()
            );


        } catch (Exception e) {

            e.printStackTrace();


            String response =
                "{\"error\":\"Failed to fetch skills\"}";


            sendResponse(
                exchange,
                500,
                response
            );
        }
    }


    /* =========================================
       HISTORY API
       GET + DELETE
       ========================================= */

    private static void handleHistory(
            HttpExchange exchange)
            throws IOException {

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Origin", "*"
        );

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Methods",
            "GET, DELETE, OPTIONS"
        );

        exchange.getResponseHeaders().set(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );


        /* OPTIONS */

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(204, -1);
            return;
        }


        /* =====================================
           DELETE HISTORY
           ===================================== */

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("DELETE")) {

            try {

                Connection connection =
                    DataBaseConnection.getConnection();


                if (connection == null) {

                    throw new Exception(
                        "Database connection failed"
                    );
                }


                /*
                 * Delete skill-gap records first
                 * because they reference students.
                 */

                String deleteSkills =
                    "DELETE FROM skill_gap";


                PreparedStatement skillStatement =
                    connection.prepareStatement(
                        deleteSkills
                    );


                skillStatement.executeUpdate();


                skillStatement.close();


                /*
                 * Delete all students.
                 */

                String deleteStudents =
                    "DELETE FROM students";


                PreparedStatement studentStatement =
                    connection.prepareStatement(
                        deleteStudents
                    );


                studentStatement.executeUpdate();


                studentStatement.close();


                connection.close();


                String response =
                    "{\"message\":\"History cleared successfully\"}";


                sendResponse(
                    exchange,
                    200,
                    response
                );


            } catch (Exception e) {

                e.printStackTrace();


                String response =
                    "{\"error\":\"Failed to clear history\"}";


                sendResponse(
                    exchange,
                    500,
                    response
                );
            }


            return;
        }


        /* =====================================
           GET HISTORY
           ===================================== */

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("GET")) {

            String response =
                "{\"error\":\"Only GET or DELETE method is allowed\"}";


            sendResponse(
                exchange,
                405,
                response
            );


            return;
        }


        try {

            Connection connection =
                DataBaseConnection.getConnection();


            if (connection == null) {

                throw new Exception(
                    "Database connection failed"
                );
            }


            String sql =
                "SELECT s.id, s.name, s.target_role, " +
                "s.skill_level, sg.skill_name, " +
                "sg.skill_status " +
                "FROM students s " +
                "LEFT JOIN skill_gap sg " +
                "ON s.id = sg.student_id " +
                "ORDER BY s.id DESC";


            PreparedStatement statement =
                connection.prepareStatement(sql);


            ResultSet result =
                statement.executeQuery();


            StringBuilder response =
                new StringBuilder("[");


            boolean first = true;


            while (result.next()) {

                if (!first) {

                    response.append(",");

                }


                response.append("{");


                response.append(
                    "\"id\":"
                );


                response.append(
                    result.getInt("id")
                );


                response.append(
                    ",\"name\":\""
                );


                response.append(
                    result.getString("name")
                );


                response.append(
                    "\",\"target_role\":\""
                );


                response.append(
                    result.getString("target_role")
                );


                response.append(
                    "\",\"skill_level\":\""
                );


                response.append(
                    result.getString("skill_level")
                );


                response.append(
                    "\",\"skill_name\":\""
                );


                String skill =
                    result.getString("skill_name");


                if (skill == null) {

                    skill = "";

                }


                response.append(skill);


                response.append(
                    "\",\"skill_status\":\""
                );


                String status =
                    result.getString("skill_status");


                if (status == null) {

                    status = "";

                }


                response.append(status);


                response.append("\"}");


                first = false;
            }


            response.append("]");


            result.close();
            statement.close();
            connection.close();


            sendResponse(
                exchange,
                200,
                response.toString()
            );


        } catch (Exception e) {

            e.printStackTrace();


            String response =
                "{\"error\":\"Failed to fetch history\"}";


            sendResponse(
                exchange,
                500,
                response
            );
        }
    }


    /* =========================================
       SEND RESPONSE
       ========================================= */

    private static void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response)
            throws IOException {

        exchange.getResponseHeaders().set(
            "Content-Type",
            "application/json"
        );


        byte[] responseBytes =
            response.getBytes(
                StandardCharsets.UTF_8
            );


        exchange.sendResponseHeaders(
            statusCode,
            responseBytes.length
        );


        OutputStream output =
            exchange.getResponseBody();


        output.write(
            responseBytes
        );


        output.close();
    }
}