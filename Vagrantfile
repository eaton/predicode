# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

$script = <<SCRIPT
  sudo apt-get update

  # Utils and fun bits
  sudo apt-get install -y curl git
  sudo apt-get install -y avahi-daemon
  sudo apt-get install -y openssh-client openssh-server
  sudo apt-get install -y memcached

  # MySQL and friends
  sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
  sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
  sudo apt-get install -y mysql-server
  mysql --user="root" --password="root" -e "create database drupal;"

  # PHP with all the fixins
  sudo apt-get install -y php5 php5-apcu php5-cli php5-curl php5-gd php5-imagick php5-json php5-mcrypt php5-memcache php5-memcached php5-mysql php5-oauth php5-readline php5-sqlite php5-xdebug php5-xhprof php5-xmlrpc

  # Install apache and screw mightily with permissions
  sudo apt-get install -y apache2 libapache2-mod-php5

  sudo echo "<VirtualHost *:80>" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  ServerName predicate.local" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  ServerAdmin webmaster@localhost" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  DocumentRoot /var/www/html" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  ErrorLog ${APACHE_LOG_DIR}/error.log" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  CustomLog ${APACHE_LOG_DIR}/access.log combined" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  <Directory /var/www>" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "    AllowOverride All" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "  </Directory>" >> /etc/apache2/sites-available/drupal.conf
  sudo echo "</VirtualHost>" >> /etc/apache2/sites-available/drupal.conf

  sudo a2dissite 000-default
  sudo a2ensite drupal
  sudo a2enmod rewrite
  sudo service apache2 restart

  # Install the latest drush
  sudo apt-get install drush -y

SCRIPT

  config.vm.box = "ubuntu/trusty32"

  # public_network mode is anoying, and forces a network device choice during provisioning.
  # however, the resulting box can be poked at by other machines on the network then, sooo

  config.vm.network "private_network", type: "dhcp"
  # config.vm.network "public_network"

  config.vm.hostname = "predicate"
  config.vm.synced_folder "www/", "/var/www/html", owner: "www-data", group: "www-data", create: true
  config.vm.synced_folder "logs/", "/var/log/apache2", create: true

  config.vm.provision "shell", inline: $script

end