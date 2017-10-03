using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script;
using System.Web.Script.Services;
using System.Text.RegularExpressions;
using System.IO;
using System.Net;
using System.Text;


namespace WebApplication2
{
    /// <summary>
    /// Description résumée de wsFileMaker
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Pour autoriser l'appel de ce service Web depuis un script à l'aide d'ASP.NET AJAX, supprimez les marques de commentaire de la ligne suivante. 
     [System.Web.Script.Services.ScriptService]
    public class wsFileMaker : System.Web.Services.WebService
    {
        private List<string> finalStrings;
        public struct task
        {
            public bool complete { get; set; } 
            public string created_at { get; set; }
            public string description { get; set; } 
            public int id { get; set; }
            public string kind { get; set; } 
            public int position { get; set; } 
            public int story_id { get; set; } 
            public string updated_at { get; set; } 
        }

        public struct story
        {
            public string accepted_at { get; set; }
            public string created_at { get; set; }
            public string current_state { get; set; }
            public int estimate { get; set; }
            public int id { get; set; }
            public string kind { get; set; }
            public string name { get; set; }
            public int owned_by_id { get; set; }
            public int planned_iteration_number { get; set; }
            public int project_id { get; set; }
            public int requested_by_id { get; set; }
            public string story_type { get; set; }
            public string updated_at { get; set; }
            public string url { get; set; } 
        }

        public struct taskedStory
        {
            public string accepted_at { get; set; }
            public string created_at { get; set; }
            public string current_state { get; set; }
            public int estimate { get; set; }
            public int id { get; set; }
            public string kind { get; set; }
            public string name { get; set; }
            public int owned_by_id { get; set; }
            public int planned_iteration_number { get; set; }
            public int project_id { get; set; }
            public int requested_by_id { get; set; }
            public string story_type { get; set; }
            public string updated_at { get; set; }
            public string url { get; set; }
            public List<task> tasks { get; set; }
        }  

        public struct project
        {
            public string name { get; set; }
            public List<taskedStory> stories { get; set; }
        }

        [WebMethod]
        public string createFile(List<task> tasks, List<story> stories)
        {
            finalStrings = new List<string>();

            var filename = "report" + DateTime.Now.ToString("dd.MM.yyy.HH.mm") + ".txt";
            filename.Replace("/", "");
            String[] infos = new String[2];
            infos[0] = filename;
            var path = Server.MapPath("~/CreatedDocs/");
            infos[1] = path + filename;
            if (File.Exists(path + filename))
            {
                File.Delete(path + filename);
                File.Create(path + filename).Close();
            }
            else
            {
                File.Create(path + filename).Close();
            }

            foreach (story story in stories)
            {
                finalStrings.Add(formatString(story.name));
                foreach (task task in tasks)
                {
                    if (task.story_id == story.id)
                    {
                        finalStrings.Add(formatString(task.description, true));
                    }
                }
            }

            File.AppendAllLines(path + filename, finalStrings);
          
            return infos[0];
        }

        
        [WebMethod]
        public string createFileFromTab(List<project> projects)
        {
            finalStrings = new List<string>();

            var filename = "report" + DateTime.Now.ToString("dd.MM.yyy.HH.mm") + ".txt";
            filename.Replace("/", "");
            String[] infos = new String[2];
            infos[0] = filename;
            var path = Server.MapPath("~/CreatedDocs/");
            infos[1] = path + filename;
            if (File.Exists(path + filename))
            {
                File.Delete(path + filename);
                File.Create(path + filename).Close();
            }
            else
            {
                File.Create(path + filename).Close();
            }
            foreach (project project in projects)
            {
                finalStrings.Add("--------------------------------------------------");

                finalStrings.Add("Nom du projet : " + project.name);
                foreach (taskedStory story in project.stories)
                {
                    finalStrings.Add(formatString(story.name));
                    foreach (task task in story.tasks)
                    {
                        if (task.story_id == story.id)
                        {
                            finalStrings.Add(formatString(task.description, true));
                        }
                    }
                }
            }

            File.AppendAllLines(path + filename, finalStrings);

            return infos[0];
        }

        private string formatString(string str, bool isTask = false)
        {
            Dictionary<string, string> regles = new Dictionary<string, string>();
            regles["[u]"] = " ECCH ";
            regles["[n]"] = " NARC ";
            regles["[k]"] = " SKHBC-KZ ";
            regles["[m]"] = " Missour ";
            regles["[e]"] = " Enjil ";
            regles["[r]"] = " RAF ";
            regles["[s]"] = " SAS ";
            regles[" maj "] = " mise à jour ";
            regles["+"] = " et ";
            regles[" sps "] = " procédures stockées ";
            regles[" sp "] = " procédure stockée ";
            regles[" bdd "] = " Base de données ";
            regles[" fk "] = " clé étrangère ";
            regles[" maj."] = " mise à jour ";
            regles[" sps."] = " procédures stockées ";
            regles[" sp."] = " procédure stockée ";
            regles[" bdd."] = " Base de données ";
            regles[" fk."] = " clé étrangère ";
            regles["##"] = "";

            str = str.ToLower();
            //Remplacement des abréviation par leur mot correspondant (dictionnaire->regles)
            foreach (KeyValuePair<string, string> regle in regles)
            {
                if (str.Contains(regle.Key))
                {
                    str = str.Replace(regle.Key, regle.Value);
                }
            }
            ////Si la phrase se finie par -'numéro' on l'enlève
            var regex = new Regex("\\.\\-[0-9\\+\\sa-z]+$");
            if (regex.IsMatch(str))
            {
                str = regex.Replace(str, "");
            }
            ////On remplace espace et plusieurs espace par un seule espace
            regex = new Regex("\\s\\s+");
            if (regex.IsMatch(str))
            {
                str = regex.Replace(str, " ");
            }


            string[] subStr = str.Split('.');
            str = "";
            foreach(string majStr in subStr)
            {
                if (majStr != "")
                {
                    string justMaj = majStr[0].ToString();
                    var leReste = majStr.Substring(1);
                    justMaj = justMaj.ToUpper();
                    str += justMaj + leReste;
                }
            }
            ////Si le dernier caractère est une lettre on place un point 
            regex = new Regex("[a-z]$");
            if (regex.IsMatch(str))
            {
                str += ".";
            }
            regex = new Regex("\\s$");
            if (regex.IsMatch(str))
            {
                regex.Replace(str, ".");
            }
            regex = new Regex("[0-9]+$");
            if (regex.IsMatch(str))
            {
                str += ".";
            }
            if (isTask)
            {
                str = "\t\u2022" + str;
            }
            else
            {
                str = "\r\n" + str;
            }
            return str;
        }
    }
}
