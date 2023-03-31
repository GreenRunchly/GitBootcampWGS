-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2023 at 04:15 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ieu_classroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `informasi`
--

CREATE TABLE `informasi` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `id_class` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Judul Informasi',
  `content` longtext NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `informasi`
--

INSERT INTO `informasi` (`id`, `id_owner`, `id_class`, `title`, `content`, `created`, `updated`) VALUES
(1, 1, 2, 'Introduction', '<p>HTML stands for Hyper Text Markup Language. It is used to design web pages using a markup language. HTML is an abbreviation of Hypertext and Markup language. Hypertext defines the link between the web pages. </p><p>The markup language is used to define the text document within the tag which defines the structure of web pages. HTML 5 is the fifth and current version of HTML. It has improved the markup available for documents and has introduced application programming interfaces (API) and Document Object Model (DOM).</p><p><strong>Features:</strong></p><ul><li>It has introduced new multimedia features which supports both audio and video controls by using &lt;audio&gt; and &lt;video&gt; tags.</li><li>There are new graphics elements including vector graphics and tags.</li><li>Enrich semantic content by including &lt;header&gt; &lt;footer&gt;, &lt;article&gt;, &lt;section&gt; and &lt;figure&gt; are added.</li><li>Drag and Drop- The user can grab an object and drag it further dropping it to a new location.</li><li>Geo-location services- It helps to locate the geographical location of a client.</li><li>Web storage facility which provides web application methods to store data on the web browser.</li><li>Uses SQL database to store data offline.</li><li>Allows drawing various shapes like triangle, rectangle, circle, etc.</li><li>Capable of handling incorrect syntax.</li><li>Easy DOCTYPE declaration i.e., &lt;!doctype html&gt;</li><li>Easy character encoding i.e., &lt;meta charset=”UTF-8″&gt;</li></ul><p><strong>New Added Elements in HTML 5:</strong></p><ul><li><strong>&lt;article&gt;:</strong> The &lt;article&gt; tag is used to represent an article. More specifically, the content within the &lt;article&gt; tag is independent from the other content of the site (even though it can be related).</li><li><strong>&lt;aside&gt;:</strong> The &lt;aside&gt; tag is used to describe the main object of the web page in a shorter way like a highlighter. It basically identifies the content that is related to the primary content of the web page but does not constitute the main intent of the primary page. The &lt;aside&gt; tag contains mainly author information, links, related content and so on.</li><li><strong>&lt;figcaption&gt;:</strong> The &lt;figcaption&gt; tag in HTML is used to set a caption to the figure element in a document.</li><li><strong>&lt;figure&gt;:</strong> The &lt;figure&gt; tag in HTML is used to add self-contained content like illustrations, diagrams, photos or codes listing in a document. It is related to main flow, but it can be used in any position of a document and the figure goes with the flow of the document and if it is removed it should not affect the flow of the document.</li><li><strong>&lt;header&gt;:</strong> It contains the section heading as well as other content, such as a navigation links, table of contents, etc.</li><li><strong>&lt;footer&gt;:</strong> The &lt;footer&gt; tag in HTML is used to define a footer of HTML document. This section contains the footer information (author information, copyright information, carriers etc.). The footer tag is used within body tag. The &lt;footer&gt; tag is new in the HTML 5. The footer elements require a start tag as well as an end tag.</li><li><strong>&lt;main&gt;:</strong> Delineates the main content of the body of a document or web app.</li><li><strong>&lt;mark&gt;:</strong> The &lt;mark&gt; tag in HTML is used to define the marked text. It is used to highlight the part of the text in the paragraph.</li><li><strong>&lt;nav&gt;:</strong> The &lt;nav&gt; tag is used to declaring the navigational section in HTML documents. Websites typically have sections dedicated to navigational links, which enables user to navigate the site. These links can be placed inside a nav tag.</li><li><strong>&lt;section&gt;:</strong> It demarcates a thematic grouping of content.</li><li><strong>&lt;details&gt;:</strong> The &lt;details&gt; tag is used for the content/information which is initially hidden but could be displayed if the user wishes to see it. This tag is used to create interactive widget which user can open or close it. The content of details tag is visible when open the set attributes.</li><li><strong>&lt;summary&gt;:</strong> The &lt;summary&gt; tag in HTML is used to define a summary for the &lt;details&gt; element. The &lt;summary&gt; element is used along with the &lt;details&gt; element and provides a summary visible to the user. When the summary is clicked by the user, the content placed inside the &lt;details&gt; element becomes visible which was previously hidden. The &lt;summary&gt; tag was added in HTML 5. The &lt;summary&gt; tag requires both starting and ending tag.</li><li><strong>&lt;time&gt;:</strong> The &lt;time&gt; tag is used to display the human-readable data/time. It can also be used to encode dates and times in a machine-readable form. The main advantage for users is that they can offer to add birthday reminders or scheduled events in their calendars and search engines can produce smarter search results.</li><li><strong>&lt;bdi&gt;:</strong> The &lt;bdi&gt; tag refers to the Bi-Directional Isolation. It differentiates a text from other text that may be formatted in different direction. This tag is used when a user generated text with an unknown direction.</li><li><strong>&lt;wbr&gt;:</strong> The &lt;wbr&gt; tag in HTML stands for word break opportunity and is used to define the position within the text which is treated as a line break by the browser. It is mostly used when the used word is too long and there are chances that the browser may break lines at the wrong place for fitting the text.</li><li><strong>&lt;datalist&gt;:</strong> The &lt;datalist&gt; tag is used to provide autocomplete feature in the HTML files. It can be used with input tag, so that users can easily fill the data in the forms using select the data.</li><li><strong>&lt;keygen&gt;:</strong> The &lt;keygen&gt; tag in HTML is used to specify a key-pair generator field in a form. The purpose of &lt;keygen&gt; element is to provide a secure way to authenticate users. When a form is submitted then two keys are generated, private key and public key. The private key stored locally, and the public key is sent to the server. The public key is used to generate client certificate to authenticate user in future.</li><li><strong>&lt;output&gt;:</strong> The &lt;output&gt; tag in HTML is used to represent the result of a calculation performed by the client-side script such as JavaScript.</li><li><strong>&lt;progress&gt;:</strong> It is used to represent the progress of a task. It also defines how much work is done and how much is left to download a task. It is not used to represent the disk space or relevant query.</li><li><strong>&lt;svg&gt;:</strong> It is the Scalable Vector Graphics.</li><li><strong>&lt;canvas&gt;:</strong> The &lt;canvas&gt; tag in HTML is used to draw graphics on web page using JavaScript. It can be used to draw paths, boxes, texts, gradient and adding images. By default, it does not contain border and text.</li><li><strong>&lt;audio&gt;:</strong> It defines the music or audio content.</li><li><strong>&lt;embed&gt;:</strong> Defines containers for external applications (usually a video player).</li><li><strong>&lt;source&gt;:</strong> It defines the sources for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;track&gt;:</strong> It defines the tracks for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;video&gt;:</strong> It defines the video content.</li></ul><p><strong>Advantages:</strong></p><ul><li>All browsers supported.</li><li>More device friendly.</li><li>Easy to use and implement.</li><li>HTML 5 in integration with CSS, JavaScript, etc. can help build beautiful websites.</li></ul><p><strong>Disadvantages:</strong></p><ul><li>Long codes have to be written which is time consuming.</li><li>Only modern browsers support it.</li></ul><p><strong>Supported Browsers:</strong> It is supported by all modern browsers. </p>', '2023-03-30 04:12:52', '2023-03-30 07:52:50'),
(2, 1, 1, 'Introduction', '<p>HTML stands for Hyper Text Markup Language. It is used to design web pages using a markup language. HTML is an abbreviation of Hypertext and Markup language. Hypertext defines the link between the web pages. </p><p>The markup language is used to define the text document within the tag which defines the structure of web pages. HTML 5 is the fifth and current version of HTML. It has improved the markup available for documents and has introduced application programming interfaces (API) and Document Object Model (DOM).</p><p><strong>Features:</strong></p><ul><li>It has introduced new multimedia features which supports both audio and video controls by using &lt;audio&gt; and &lt;video&gt; tags.</li><li>There are new graphics elements including vector graphics and tags.</li><li>Enrich semantic content by including &lt;header&gt; &lt;footer&gt;, &lt;article&gt;, &lt;section&gt; and &lt;figure&gt; are added.</li><li>Drag and Drop- The user can grab an object and drag it further dropping it to a new location.</li><li>Geo-location services- It helps to locate the geographical location of a client.</li><li>Web storage facility which provides web application methods to store data on the web browser.</li><li>Uses SQL database to store data offline.</li><li>Allows drawing various shapes like triangle, rectangle, circle, etc.</li><li>Capable of handling incorrect syntax.</li><li>Easy DOCTYPE declaration i.e., &lt;!doctype html&gt;</li><li>Easy character encoding i.e., &lt;meta charset=”UTF-8″&gt;</li></ul><p><strong>New Added Elements in HTML 5:</strong></p><ul><li><strong>&lt;article&gt;:</strong> The &lt;article&gt; tag is used to represent an article. More specifically, the content within the &lt;article&gt; tag is independent from the other content of the site (even though it can be related).</li><li><strong>&lt;aside&gt;:</strong> The &lt;aside&gt; tag is used to describe the main object of the web page in a shorter way like a highlighter. It basically identifies the content that is related to the primary content of the web page but does not constitute the main intent of the primary page. The &lt;aside&gt; tag contains mainly author information, links, related content and so on.</li><li><strong>&lt;figcaption&gt;:</strong> The &lt;figcaption&gt; tag in HTML is used to set a caption to the figure element in a document.</li><li><strong>&lt;figure&gt;:</strong> The &lt;figure&gt; tag in HTML is used to add self-contained content like illustrations, diagrams, photos or codes listing in a document. It is related to main flow, but it can be used in any position of a document and the figure goes with the flow of the document and if it is removed it should not affect the flow of the document.</li><li><strong>&lt;header&gt;:</strong> It contains the section heading as well as other content, such as a navigation links, table of contents, etc.</li><li><strong>&lt;footer&gt;:</strong> The &lt;footer&gt; tag in HTML is used to define a footer of HTML document. This section contains the footer information (author information, copyright information, carriers etc.). The footer tag is used within body tag. The &lt;footer&gt; tag is new in the HTML 5. The footer elements require a start tag as well as an end tag.</li><li><strong>&lt;main&gt;:</strong> Delineates the main content of the body of a document or web app.</li><li><strong>&lt;mark&gt;:</strong> The &lt;mark&gt; tag in HTML is used to define the marked text. It is used to highlight the part of the text in the paragraph.</li><li><strong>&lt;nav&gt;:</strong> The &lt;nav&gt; tag is used to declaring the navigational section in HTML documents. Websites typically have sections dedicated to navigational links, which enables user to navigate the site. These links can be placed inside a nav tag.</li><li><strong>&lt;section&gt;:</strong> It demarcates a thematic grouping of content.</li><li><strong>&lt;details&gt;:</strong> The &lt;details&gt; tag is used for the content/information which is initially hidden but could be displayed if the user wishes to see it. This tag is used to create interactive widget which user can open or close it. The content of details tag is visible when open the set attributes.</li><li><strong>&lt;summary&gt;:</strong> The &lt;summary&gt; tag in HTML is used to define a summary for the &lt;details&gt; element. The &lt;summary&gt; element is used along with the &lt;details&gt; element and provides a summary visible to the user. When the summary is clicked by the user, the content placed inside the &lt;details&gt; element becomes visible which was previously hidden. The &lt;summary&gt; tag was added in HTML 5. The &lt;summary&gt; tag requires both starting and ending tag.</li><li><strong>&lt;time&gt;:</strong> The &lt;time&gt; tag is used to display the human-readable data/time. It can also be used to encode dates and times in a machine-readable form. The main advantage for users is that they can offer to add birthday reminders or scheduled events in their calendars and search engines can produce smarter search results.</li><li><strong>&lt;bdi&gt;:</strong> The &lt;bdi&gt; tag refers to the Bi-Directional Isolation. It differentiates a text from other text that may be formatted in different direction. This tag is used when a user generated text with an unknown direction.</li><li><strong>&lt;wbr&gt;:</strong> The &lt;wbr&gt; tag in HTML stands for word break opportunity and is used to define the position within the text which is treated as a line break by the browser. It is mostly used when the used word is too long and there are chances that the browser may break lines at the wrong place for fitting the text.</li><li><strong>&lt;datalist&gt;:</strong> The &lt;datalist&gt; tag is used to provide autocomplete feature in the HTML files. It can be used with input tag, so that users can easily fill the data in the forms using select the data.</li><li><strong>&lt;keygen&gt;:</strong> The &lt;keygen&gt; tag in HTML is used to specify a key-pair generator field in a form. The purpose of &lt;keygen&gt; element is to provide a secure way to authenticate users. When a form is submitted then two keys are generated, private key and public key. The private key stored locally, and the public key is sent to the server. The public key is used to generate client certificate to authenticate user in future.</li><li><strong>&lt;output&gt;:</strong> The &lt;output&gt; tag in HTML is used to represent the result of a calculation performed by the client-side script such as JavaScript.</li><li><strong>&lt;progress&gt;:</strong> It is used to represent the progress of a task. It also defines how much work is done and how much is left to download a task. It is not used to represent the disk space or relevant query.</li><li><strong>&lt;svg&gt;:</strong> It is the Scalable Vector Graphics.</li><li><strong>&lt;canvas&gt;:</strong> The &lt;canvas&gt; tag in HTML is used to draw graphics on web page using JavaScript. It can be used to draw paths, boxes, texts, gradient and adding images. By default, it does not contain border and text.</li><li><strong>&lt;audio&gt;:</strong> It defines the music or audio content.</li><li><strong>&lt;embed&gt;:</strong> Defines containers for external applications (usually a video player).</li><li><strong>&lt;source&gt;:</strong> It defines the sources for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;track&gt;:</strong> It defines the tracks for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;video&gt;:</strong> It defines the video content.</li></ul><p><strong>Advantages:</strong></p><ul><li>All browsers supported.</li><li>More device friendly.</li><li>Easy to use and implement.</li><li>HTML 5 in integration with CSS, JavaScript, etc. can help build beautiful websites.</li></ul><p><strong>Disadvantages:</strong></p><ul><li>Long codes have to be written which is time consuming.</li><li>Only modern browsers support it.</li></ul><p><strong>Supported Browsers:</strong> It is supported by all modern browsers. </p>', '2023-03-30 04:19:35', '2023-03-30 07:47:43'),
(3, 1, 3, 'Introduction of HTML 5', '<p>HTML stands for Hyper Text Markup Language. It is used to design web pages using a markup language. HTML is an abbreviation of Hypertext and Markup language. Hypertext defines the link between the web pages. </p><p>The markup language is used to define the text document within the tag which defines the structure of web pages. HTML 5 is the fifth and current version of HTML. It has improved the markup available for documents and has introduced application programming interfaces (API) and Document Object Model (DOM).</p><p><strong>Features:</strong></p><ul><li>It has introduced new multimedia features which supports both audio and video controls by using &lt;audio&gt; and &lt;video&gt; tags.</li><li>There are new graphics elements including vector graphics and tags.</li><li>Enrich semantic content by including &lt;header&gt; &lt;footer&gt;, &lt;article&gt;, &lt;section&gt; and &lt;figure&gt; are added.</li><li>Drag and Drop- The user can grab an object and drag it further dropping it to a new location.</li><li>Geo-location services- It helps to locate the geographical location of a client.</li><li>Web storage facility which provides web application methods to store data on the web browser.</li><li>Uses SQL database to store data offline.</li><li>Allows drawing various shapes like triangle, rectangle, circle, etc.</li><li>Capable of handling incorrect syntax.</li><li>Easy DOCTYPE declaration i.e., &lt;!doctype html&gt;</li><li>Easy character encoding i.e., &lt;meta charset=”UTF-8″&gt;</li></ul><p><strong>New Added Elements in HTML 5:</strong></p><ul><li><strong>&lt;article&gt;:</strong> The &lt;article&gt; tag is used to represent an article. More specifically, the content within the &lt;article&gt; tag is independent from the other content of the site (even though it can be related).</li><li><strong>&lt;aside&gt;:</strong> The &lt;aside&gt; tag is used to describe the main object of the web page in a shorter way like a highlighter. It basically identifies the content that is related to the primary content of the web page but does not constitute the main intent of the primary page. The &lt;aside&gt; tag contains mainly author information, links, related content and so on.</li><li><strong>&lt;figcaption&gt;:</strong> The &lt;figcaption&gt; tag in HTML is used to set a caption to the figure element in a document.</li><li><strong>&lt;figure&gt;:</strong> The &lt;figure&gt; tag in HTML is used to add self-contained content like illustrations, diagrams, photos or codes listing in a document. It is related to main flow, but it can be used in any position of a document and the figure goes with the flow of the document and if it is removed it should not affect the flow of the document.</li><li><strong>&lt;header&gt;:</strong> It contains the section heading as well as other content, such as a navigation links, table of contents, etc.</li><li><strong>&lt;footer&gt;:</strong> The &lt;footer&gt; tag in HTML is used to define a footer of HTML document. This section contains the footer information (author information, copyright information, carriers etc.). The footer tag is used within body tag. The &lt;footer&gt; tag is new in the HTML 5. The footer elements require a start tag as well as an end tag.</li><li><strong>&lt;main&gt;:</strong> Delineates the main content of the body of a document or web app.</li><li><strong>&lt;mark&gt;:</strong> The &lt;mark&gt; tag in HTML is used to define the marked text. It is used to highlight the part of the text in the paragraph.</li><li><strong>&lt;nav&gt;:</strong> The &lt;nav&gt; tag is used to declaring the navigational section in HTML documents. Websites typically have sections dedicated to navigational links, which enables user to navigate the site. These links can be placed inside a nav tag.</li><li><strong>&lt;section&gt;:</strong> It demarcates a thematic grouping of content.</li><li><strong>&lt;details&gt;:</strong> The &lt;details&gt; tag is used for the content/information which is initially hidden but could be displayed if the user wishes to see it. This tag is used to create interactive widget which user can open or close it. The content of details tag is visible when open the set attributes.</li><li><strong>&lt;summary&gt;:</strong> The &lt;summary&gt; tag in HTML is used to define a summary for the &lt;details&gt; element. The &lt;summary&gt; element is used along with the &lt;details&gt; element and provides a summary visible to the user. When the summary is clicked by the user, the content placed inside the &lt;details&gt; element becomes visible which was previously hidden. The &lt;summary&gt; tag was added in HTML 5. The &lt;summary&gt; tag requires both starting and ending tag.</li><li><strong>&lt;time&gt;:</strong> The &lt;time&gt; tag is used to display the human-readable data/time. It can also be used to encode dates and times in a machine-readable form. The main advantage for users is that they can offer to add birthday reminders or scheduled events in their calendars and search engines can produce smarter search results.</li><li><strong>&lt;bdi&gt;:</strong> The &lt;bdi&gt; tag refers to the Bi-Directional Isolation. It differentiates a text from other text that may be formatted in different direction. This tag is used when a user generated text with an unknown direction.</li><li><strong>&lt;wbr&gt;:</strong> The &lt;wbr&gt; tag in HTML stands for word break opportunity and is used to define the position within the text which is treated as a line break by the browser. It is mostly used when the used word is too long and there are chances that the browser may break lines at the wrong place for fitting the text.</li><li><strong>&lt;datalist&gt;:</strong> The &lt;datalist&gt; tag is used to provide autocomplete feature in the HTML files. It can be used with input tag, so that users can easily fill the data in the forms using select the data.</li><li><strong>&lt;keygen&gt;:</strong> The &lt;keygen&gt; tag in HTML is used to specify a key-pair generator field in a form. The purpose of &lt;keygen&gt; element is to provide a secure way to authenticate users. When a form is submitted then two keys are generated, private key and public key. The private key stored locally, and the public key is sent to the server. The public key is used to generate client certificate to authenticate user in future.</li><li><strong>&lt;output&gt;:</strong> The &lt;output&gt; tag in HTML is used to represent the result of a calculation performed by the client-side script such as JavaScript.</li><li><strong>&lt;progress&gt;:</strong> It is used to represent the progress of a task. It also defines how much work is done and how much is left to download a task. It is not used to represent the disk space or relevant query.</li><li><strong>&lt;svg&gt;:</strong> It is the Scalable Vector Graphics.</li><li><strong>&lt;canvas&gt;:</strong> The &lt;canvas&gt; tag in HTML is used to draw graphics on web page using JavaScript. It can be used to draw paths, boxes, texts, gradient and adding images. By default, it does not contain border and text.</li><li><strong>&lt;audio&gt;:</strong> It defines the music or audio content.</li><li><strong>&lt;embed&gt;:</strong> Defines containers for external applications (usually a video player).</li><li><strong>&lt;source&gt;:</strong> It defines the sources for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;track&gt;:</strong> It defines the tracks for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;video&gt;:</strong> It defines the video content.</li></ul><p><strong>Advantages:</strong></p><ul><li>All browsers supported.</li><li>More device friendly.</li><li>Easy to use and implement.</li><li>HTML 5 in integration with CSS, JavaScript, etc. can help build beautiful websites.</li></ul><p><strong>Disadvantages:</strong></p><ul><li>Long codes have to be written which is time consuming.</li><li>Only modern browsers support it.</li></ul><p><strong>Supported Browsers:</strong> It is supported by all modern browsers. </p>', '2023-03-30 08:18:23', '2023-03-30 16:13:33'),
(4, 1, 4, 'asdfg', '<p>HTML stands for Hyper Text Markup Language. It is used to design web pages using a markup language. HTML is an abbreviation of Hypertext and Markup language. Hypertext defines the link between the web pages. </p><p>The markup language is used to define the text document within the tag which defines the structure of web pages. HTML 5 is the fifth and current version of HTML. It has improved the markup available for documents and has introduced application programming interfaces (API) and Document Object Model (DOM).</p><p><strong>Features:</strong></p><ul><li>It has introduced new multimedia features which supports both audio and video controls by using &lt;audio&gt; and &lt;video&gt; tags.</li><li>There are new graphics elements including vector graphics and tags.</li><li>Enrich semantic content by including &lt;header&gt; &lt;footer&gt;, &lt;article&gt;, &lt;section&gt; and &lt;figure&gt; are added.</li><li>Drag and Drop- The user can grab an object and drag it further dropping it to a new location.</li><li>Geo-location services- It helps to locate the geographical location of a client.</li><li>Web storage facility which provides web application methods to store data on the web browser.</li><li>Uses SQL database to store data offline.</li><li>Allows drawing various shapes like triangle, rectangle, circle, etc.</li><li>Capable of handling incorrect syntax.</li><li>Easy DOCTYPE declaration i.e., &lt;!doctype html&gt;</li><li>Easy character encoding i.e., &lt;meta charset=”UTF-8″&gt;</li></ul><p><strong>New Added Elements in HTML 5:</strong></p><ul><li><strong>&lt;article&gt;:</strong> The &lt;article&gt; tag is used to represent an article. More specifically, the content within the &lt;article&gt; tag is independent from the other content of the site (even though it can be related).</li><li><strong>&lt;aside&gt;:</strong> The &lt;aside&gt; tag is used to describe the main object of the web page in a shorter way like a highlighter. It basically identifies the content that is related to the primary content of the web page but does not constitute the main intent of the primary page. The &lt;aside&gt; tag contains mainly author information, links, related content and so on.</li><li><strong>&lt;figcaption&gt;:</strong> The &lt;figcaption&gt; tag in HTML is used to set a caption to the figure element in a document.</li><li><strong>&lt;figure&gt;:</strong> The &lt;figure&gt; tag in HTML is used to add self-contained content like illustrations, diagrams, photos or codes listing in a document. It is related to main flow, but it can be used in any position of a document and the figure goes with the flow of the document and if it is removed it should not affect the flow of the document.</li><li><strong>&lt;header&gt;:</strong> It contains the section heading as well as other content, such as a navigation links, table of contents, etc.</li><li><strong>&lt;footer&gt;:</strong> The &lt;footer&gt; tag in HTML is used to define a footer of HTML document. This section contains the footer information (author information, copyright information, carriers etc.). The footer tag is used within body tag. The &lt;footer&gt; tag is new in the HTML 5. The footer elements require a start tag as well as an end tag.</li><li><strong>&lt;main&gt;:</strong> Delineates the main content of the body of a document or web app.</li><li><strong>&lt;mark&gt;:</strong> The &lt;mark&gt; tag in HTML is used to define the marked text. It is used to highlight the part of the text in the paragraph.</li><li><strong>&lt;nav&gt;:</strong> The &lt;nav&gt; tag is used to declaring the navigational section in HTML documents. Websites typically have sections dedicated to navigational links, which enables user to navigate the site. These links can be placed inside a nav tag.</li><li><strong>&lt;section&gt;:</strong> It demarcates a thematic grouping of content.</li><li><strong>&lt;details&gt;:</strong> The &lt;details&gt; tag is used for the content/information which is initially hidden but could be displayed if the user wishes to see it. This tag is used to create interactive widget which user can open or close it. The content of details tag is visible when open the set attributes.</li><li><strong>&lt;summary&gt;:</strong> The &lt;summary&gt; tag in HTML is used to define a summary for the &lt;details&gt; element. The &lt;summary&gt; element is used along with the &lt;details&gt; element and provides a summary visible to the user. When the summary is clicked by the user, the content placed inside the &lt;details&gt; element becomes visible which was previously hidden. The &lt;summary&gt; tag was added in HTML 5. The &lt;summary&gt; tag requires both starting and ending tag.</li><li><strong>&lt;time&gt;:</strong> The &lt;time&gt; tag is used to display the human-readable data/time. It can also be used to encode dates and times in a machine-readable form. The main advantage for users is that they can offer to add birthday reminders or scheduled events in their calendars and search engines can produce smarter search results.</li><li><strong>&lt;bdi&gt;:</strong> The &lt;bdi&gt; tag refers to the Bi-Directional Isolation. It differentiates a text from other text that may be formatted in different direction. This tag is used when a user generated text with an unknown direction.</li><li><strong>&lt;wbr&gt;:</strong> The &lt;wbr&gt; tag in HTML stands for word break opportunity and is used to define the position within the text which is treated as a line break by the browser. It is mostly used when the used word is too long and there are chances that the browser may break lines at the wrong place for fitting the text.</li><li><strong>&lt;datalist&gt;:</strong> The &lt;datalist&gt; tag is used to provide autocomplete feature in the HTML files. It can be used with input tag, so that users can easily fill the data in the forms using select the data.</li><li><strong>&lt;keygen&gt;:</strong> The &lt;keygen&gt; tag in HTML is used to specify a key-pair generator field in a form. The purpose of &lt;keygen&gt; element is to provide a secure way to authenticate users. When a form is submitted then two keys are generated, private key and public key. The private key stored locally, and the public key is sent to the server. The public key is used to generate client certificate to authenticate user in future.</li><li><strong>&lt;output&gt;:</strong> The &lt;output&gt; tag in HTML is used to represent the result of a calculation performed by the client-side script such as JavaScript.</li><li><strong>&lt;progress&gt;:</strong> It is used to represent the progress of a task. It also defines how much work is done and how much is left to download a task. It is not used to represent the disk space or relevant query.</li><li><strong>&lt;svg&gt;:</strong> It is the Scalable Vector Graphics.</li><li><strong>&lt;canvas&gt;:</strong> The &lt;canvas&gt; tag in HTML is used to draw graphics on web page using JavaScript. It can be used to draw paths, boxes, texts, gradient and adding images. By default, it does not contain border and text.</li><li><strong>&lt;audio&gt;:</strong> It defines the music or audio content.</li><li><strong>&lt;embed&gt;:</strong> Defines containers for external applications (usually a video player).</li><li><strong>&lt;source&gt;:</strong> It defines the sources for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;track&gt;:</strong> It defines the tracks for &lt;video&gt; and &lt;audio&gt;.</li><li><strong>&lt;video&gt;:</strong> It defines the video content.</li></ul><p><strong>Advantages:</strong></p><ul><li>All browsers supported.</li><li>More device friendly.</li><li>Easy to use and implement.</li><li>HTML 5 in integration with CSS, JavaScript, etc. can help build beautiful websites.</li></ul><p><strong>Disadvantages:</strong></p><ul><li>Long codes have to be written which is time consuming.</li><li>Only modern browsers support it.</li></ul><p><strong>Supported Browsers:</strong> It is supported by all modern browsers. </p>', '2023-03-30 16:26:42', '2023-03-30 16:26:42');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `class_desc` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `room` varchar(100) NOT NULL,
  `visible` varchar(10) NOT NULL DEFAULT 'private',
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `id_owner`, `class_name`, `class_desc`, `subject`, `room`, `visible`, `created`, `updated`) VALUES
(1, 1, 'Bootcamp Front-End with HTML 5', 'Yang ingin belajar HTML 5, bisa join!', 'HTML 5', 'Web', 'private', '2023-03-30 03:46:10', '2023-03-30 04:20:16'),
(2, 1, 'Bootcamp Back-End with PHP', 'Bahasa pemrograman interpreter terbaik dalam sejarah internet!', 'PHP Programming', 'Web', 'private', '2023-03-30 04:07:15', '2023-03-30 04:07:15'),
(3, 1, 'Pemograman Dasar', 'Untuk belajar program', 'Bahasa HTML, CSS, Javascript', '10110', 'private', '2023-03-30 08:15:04', '2023-03-30 08:15:04'),
(4, 1, 'Kelas Backup', '', 'Pembelajaran Abadi', 'Ruang Nikah', 'private', '2023-03-30 16:22:55', '2023-03-30 16:29:09');

-- --------------------------------------------------------

--
-- Table structure for table `kelas_invite`
--

CREATE TABLE `kelas_invite` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `id_class` int(11) NOT NULL,
  `invite_code` varchar(12) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kelas_invite`
--

INSERT INTO `kelas_invite` (`id`, `id_owner`, `id_class`, `invite_code`, `created`, `updated`) VALUES
(1, 1, 2, '440463341704', '2023-03-30 04:18:04', '2023-03-30 04:40:53'),
(2, 1, 1, '681270296265', '2023-03-30 04:19:42', '2023-03-30 07:13:54'),
(3, 1, 3, '885205605199', '2023-03-30 08:15:57', '2023-03-30 16:19:34'),
(4, 1, 4, '596253085597', '2023-03-30 16:23:01', '2023-03-30 16:26:46');

-- --------------------------------------------------------

--
-- Table structure for table `otp_request`
--

CREATE TABLE `otp_request` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `code` varchar(8) NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'unverified',
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`id`, `username`, `email`, `phone_number`, `password`, `name`, `created`, `updated`) VALUES
(1, 'rizki', 'ilfan.indo@gmail.com', '6281221925082', '12345', 'Rizki Irfan Anshori', '2023-03-18 14:53:34', '2023-03-28 00:39:42'),
(2, 'jeni', 'jeni@gmail.com', '62811158381', '12345', 'Jeni', '2023-03-18 14:53:34', '2023-03-28 01:51:20'),
(3, 'Anna', 'anna@gmail.com', '6281283936933', '12345', 'Anna Devina', '2023-03-18 14:53:34', '2023-03-28 00:25:37');

-- --------------------------------------------------------

--
-- Table structure for table `pengguna_class_joined`
--

CREATE TABLE `pengguna_class_joined` (
  `id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `id_class` int(50) NOT NULL,
  `created` timestamp NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pengguna_class_joined`
--

INSERT INTO `pengguna_class_joined` (`id`, `id_owner`, `id_class`, `created`, `updated`) VALUES
(4, 1, 3, '2023-03-30 08:15:04', '2023-03-30 08:15:04'),
(7, 2, 3, '2023-03-30 08:19:44', '2023-03-30 08:19:44'),
(10, 1, 4, '2023-03-30 16:26:56', '2023-03-30 16:26:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `informasi`
--
ALTER TABLE `informasi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kelas_invite`
--
ALTER TABLE `kelas_invite`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp_request`
--
ALTER TABLE `otp_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengguna_class_joined`
--
ALTER TABLE `pengguna_class_joined`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `informasi`
--
ALTER TABLE `informasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kelas_invite`
--
ALTER TABLE `kelas_invite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `otp_request`
--
ALTER TABLE `otp_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pengguna_class_joined`
--
ALTER TABLE `pengguna_class_joined`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
